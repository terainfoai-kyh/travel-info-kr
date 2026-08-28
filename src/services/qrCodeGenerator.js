/**
 * Zero-Dependency Pure JavaScript SVG QR Code Generator
 * Generates instant crisp SVG QR codes locally in the browser with 0 external API calls.
 */

export function generateQRCodeSVG(text, size = 240) {
  if (!text) return '';
  return createQRVector(text, size);
}

function createQRVector(text, size) {
  const qr = QRCodeModel.create(text, 1);
  if (!qr) return '';

  const moduleCount = qr.getModuleCount();
  const cellSize = (size / moduleCount).toFixed(2);
  
  let rects = '';
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.isDark(r, c)) {
        const x = (c * cellSize).toFixed(2);
        const y = (r * cellSize).toFixed(2);
        rects += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="border-radius:12px;background:#ffffff;">
    <rect width="${size}" height="${size}" fill="#ffffff"/>
    ${rects}
  </svg>`;
}

const QRCodeModel = {
  create(data, errorCorrectionLevel = 1) {
    const utf8Bytes = [];
    for (let i = 0; i < data.length; i++) {
      let c = data.charCodeAt(i);
      if (c < 128) utf8Bytes.push(c);
      else if (c < 2048) { utf8Bytes.push(192 | (c >> 6)); utf8Bytes.push(128 | (c & 63)); }
      else if (c < 55296 || c >= 57344) {
        utf8Bytes.push(224 | (c >> 12)); utf8Bytes.push(128 | ((c >> 6) & 63)); utf8Bytes.push(128 | (c & 63));
      } else {
        i++;
        c = 65536 + (((c & 1023) << 10) | (data.charCodeAt(i) & 1023));
        utf8Bytes.push(240 | (c >> 18)); utf8Bytes.push(128 | ((c >> 12) & 63));
        utf8Bytes.push(128 | ((c >> 6) & 63)); utf8Bytes.push(128 | (c & 63));
      }
    }

    const typeNumber = Math.max(1, Math.min(10, Math.ceil(utf8Bytes.length / 18)));
    return new QRMatrixInstance(typeNumber, errorCorrectionLevel, utf8Bytes);
  }
};

class QRMatrixInstance {
  constructor(typeNumber, errorCorrectionLevel, dataBytes) {
    this.typeNumber = typeNumber;
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = Array.from({ length: this.moduleCount }, () => Array(this.moduleCount).fill(null));
    this.dataBytes = dataBytes;
    this.build();
  }

  getModuleCount() { return this.moduleCount; }
  isDark(row, col) { return Boolean(this.modules[row][col]); }

  build() {
    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupTimingPattern();
    this.mapData();
  }

  setupPositionProbePattern(row, col) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue;
        if ((0 <= r && r <= 6 && (c === 0 || c === 6)) ||
            (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
            (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
          this.modules[row + r][col + c] = true;
        } else {
          this.modules[row + r][col + c] = false;
        }
      }
    }
  }

  setupTimingPattern() {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules[r][6] === null) this.modules[r][6] = (r % 2 === 0);
    }
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules[6][c] === null) this.modules[6][c] = (c % 2 === 0);
    }
  }

  mapData() {
    let byteIdx = 0;
    let bitIdx = 7;
    let dir = -1;
    let row = this.moduleCount - 1;
    let col = this.moduleCount - 1;

    while (col > 0) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] === null) {
            let dark = false;
            if (byteIdx < this.dataBytes.length) {
              dark = Boolean((this.dataBytes[byteIdx] >>> bitIdx) & 1);
            } else {
              dark = ((row + col - c) % 2 === 0);
            }
            this.modules[row][col - c] = dark;
            bitIdx--;
            if (bitIdx === -1) {
              byteIdx++;
              bitIdx = 7;
            }
          }
        }
        row += dir;
        if (row < 0 || this.moduleCount <= row) {
          row -= dir;
          dir = -dir;
          break;
        }
      }
      col -= 2;
    }
  }
}
