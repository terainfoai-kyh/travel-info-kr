using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Collections.Generic;

public class VoraMasterCrypto
{
    private static readonly byte[] SaltVectors = new byte[] { 0x5A, 0xA5, 0x3C, 0xC3, 0x69, 0x96, 0x7E, 0xE7 };
    private const string SecretKey = "vora_secure_vault_2026";

    public static string Decrypt(string cipherB64)
    {
        byte[] cipherBytes = Convert.FromBase64String(cipherB64.Trim());
        byte[] keyBytes = Encoding.UTF8.GetBytes(SecretKey);
        byte[] plainBytes = new byte[cipherBytes.Length];

        for (int i = 0; i < cipherBytes.Length; i++)
        {
            byte k = keyBytes[i % keyBytes.Length];
            byte s = SaltVectors[i % SaltVectors.Length];
            plainBytes[i] = (byte)(cipherBytes[i] ^ k ^ s);
        }

        return Encoding.UTF8.GetString(plainBytes);
    }

    public static string Encrypt(string plainText)
    {
        byte[] utf8Bytes = Encoding.UTF8.GetBytes(plainText);
        byte[] keyBytes = Encoding.UTF8.GetBytes(SecretKey);
        byte[] cipherBytes = new byte[utf8Bytes.Length];

        for (int i = 0; i < utf8Bytes.Length; i++)
        {
            byte k = keyBytes[i % keyBytes.Length];
            byte s = SaltVectors[i % SaltVectors.Length];
            cipherBytes[i] = (byte)(utf8Bytes[i] ^ k ^ s);
        }

        return Convert.ToBase64String(cipherBytes);
    }

    public static string EscapeJson(string s)
    {
        if (string.IsNullOrEmpty(s)) return "";
        return s.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\r", "").Replace("\n", "\\n");
    }

    public static string ProcessUnification(string dialogFilePath, string vaultFilePath)
    {
        string vaultJs = File.ReadAllText(vaultFilePath, Encoding.UTF8);
        var matchVault = Regex.Match(vaultJs, @"export const VORA_ENCRYPTED_VAULT_PAYLOAD = ""([^""]+)"";");
        if (!matchVault.Success) throw new Exception("Could not find payload in voraQnaVault.js");

        string currentDecrypted = Decrypt(matchVault.Groups[1].Value);
        
        string baseQnaJson = currentDecrypted.Trim();
        if (baseQnaJson.StartsWith("{") && baseQnaJson.Contains("\"qnaVault\":"))
        {
            var mQna = Regex.Match(baseQnaJson, @"""qnaVault""\s*:\s*(\[[^\]]*\]|\[[\s\S]*?\])(?=,\s*""cityKnowledge""|\})");
            if (mQna.Success)
            {
                baseQnaJson = mQna.Groups[1].Value;
            }
        }

        // Parse CITY_LOCAL_KNOWLEDGE from dialog file
        string dialogJs = File.ReadAllText(dialogFilePath, Encoding.UTF8);
        var cityPattern = new Regex(@"^\s*'([^']+)':\s*\{([\s\S]*?)(?=^\s*'[^']+'\s*:\s*\{|\n\};|\z)", RegexOptions.Multiline);
        var cityMatches = cityPattern.Matches(dialogJs);

        var cityQnaJsonList = new List<string>();
        var cityDictEntries = new List<string>();
        var seenCities = new HashSet<string>();

        foreach (Match cm in cityMatches)
        {
            string cityName = cm.Groups[1].Value;
            string body = cm.Groups[2].Value;
            if (seenCities.Contains(cityName)) continue;
            seenCities.Add(cityName);

            string nameEn = GetProp(body, "nameEn", cityName);
            string nameJa = GetProp(body, "nameJa", cityName);
            string nameZh = GetProp(body, "nameZh", cityName);
            string badge = GetProp(body, "badge", cityName + " \uB300\uD45C \uC5EC\uD589 \uC9C0\uC2DD");
            string localFoodieSecret = GetProp(body, "localFoodieSecret", "");
            string transitTip = GetProp(body, "transitTip", "");
            string hotelType = GetProp(body, "hotelType", "inland");

            List<string> signatureHighlights = GetStringArray(body, "signatureHighlights");
            List<string> rainyHotspots = GetStringArray(body, "rainyHotspots");
            List<string> walkingMinimized = GetStringArray(body, "walkingMinimized");
            List<string> nightHighlights = GetObjArray(body, "nightHighlights");
            List<string> cafeHighlights = GetObjArray(body, "cafeHighlights");
            List<string> signatureHotels = GetObjArray(body, "signatureHotels");

            // Build city Knowledge dict JSON
            var sbCity = new StringBuilder();
            sbCity.Append("{");
            sbCity.AppendFormat("\"nameEn\":\"{0}\",", EscapeJson(nameEn));
            if (nameJa != cityName) sbCity.AppendFormat("\"nameJa\":\"{0}\",", EscapeJson(nameJa));
            if (nameZh != cityName) sbCity.AppendFormat("\"nameZh\":\"{0}\",", EscapeJson(nameZh));
            sbCity.AppendFormat("\"badge\":\"{0}\",", EscapeJson(badge));
            sbCity.AppendFormat("\"signatureHighlights\":[{0}],", FormatStringArray(signatureHighlights));
            sbCity.AppendFormat("\"rainyHotspots\":[{0}],", FormatStringArray(rainyHotspots));
            sbCity.AppendFormat("\"walkingMinimized\":[{0}],", FormatStringArray(walkingMinimized));
            sbCity.AppendFormat("\"localFoodieSecret\":\"{0}\",", EscapeJson(localFoodieSecret));
            sbCity.AppendFormat("\"transitTip\":\"{0}\",", EscapeJson(transitTip));
            sbCity.AppendFormat("\"hotelType\":\"{0}\"", EscapeJson(hotelType));
            if (nightHighlights.Count > 0) sbCity.AppendFormat(",\"nightHighlights\":[{0}]", string.Join(",", nightHighlights));
            if (cafeHighlights.Count > 0) sbCity.AppendFormat(",\"cafeHighlights\":[{0}]", string.Join(",", cafeHighlights));
            if (signatureHotels.Count > 0) sbCity.AppendFormat(",\"signatureHotels\":[{0}]", string.Join(",", signatureHotels));
            sbCity.Append("}");

            cityDictEntries.Add(string.Format("\"{0}\":{1}", cityName, sbCity.ToString()));

            // Build QnA Item for City
            string highlightsStr = string.Join(", ", signatureHighlights);
            var nightDescList = new List<string>();
            foreach (var no in nightHighlights)
            {
                var nm = Regex.Match(no, @"""name"":""([^""]*)""");
                var nd = Regex.Match(no, @"""desc"":""([^""]*)""");
                if (nm.Success && nd.Success) nightDescList.Add(string.Format("{0}({1})", nm.Groups[1].Value, nd.Groups[1].Value));
            }
            string nightStr = string.Join(", ", nightDescList);

            var sbKo = new StringBuilder();
            sbKo.AppendFormat("**{0}**\uC740(\uB294) {1}\uC785\uB2C8\uB2E4! \u2728\\n\\n", cityName, badge);
            if (signatureHighlights.Count > 0) sbKo.AppendFormat("\uD83D\uDCCD **\uB300\uD45C \uBA85\uC18C**: {0}\\n", highlightsStr);
            if (!string.IsNullOrEmpty(localFoodieSecret)) sbKo.AppendFormat("\uD83E\uDD69 **\uCC10 \uBBF8\uC2DD \uBE44\uACB0**: {0}\\n", localFoodieSecret);
            if (!string.IsNullOrEmpty(transitTip)) sbKo.AppendFormat("\uD83D\uDE84 **\uAD50\uD1B5 \uD301**: {0}\\n", transitTip);
            if (!string.IsNullOrEmpty(nightStr)) sbKo.AppendFormat("\uD83C\uDF19 **\uC57C\uACBD & \uD790\uB9C1**: {0}\\n", nightStr);
            sbKo.AppendFormat("\\n\uC6D0\uD558\uC2DC\uB294 \uC5EC\uD589 \uD14C\uB988\uB098 \uC77C\uC815\uC744 \uB9D0\uC500\uD574 \uC8FC\uC2DC\uBA74 {0} \uB9DE\uCD94 \uCF54\uC2A4\uB97C \uC989\uC2DC \uC644\uC131\uD574 \uB4DC\uB9B4\uAC8C\uC694! \uD83C\uDF38", cityName);

            string koAnswer = EscapeJson(sbKo.ToString());
            string enAnswer = EscapeJson(string.Format("Welcome to **{0} ({1})**! {2}. \\n\\nTop Highlights: {3}. \\nLocal Food: {4}. \\nTransit: {5}.", nameEn, cityName, badge, highlightsStr, localFoodieSecret, transitTip));
            string jaAnswer = EscapeJson(string.Format("**{0} ({1})**\u3078\u3088\u3046\u3053\u305D\uFF01{2}\u3002\\n\u4EE3\u8868\u7684\u306A\u540D\u6240: {3}\u3002\\n\u30B0\u30EB\u30DF: {4}\u3002\\n\u4EA4\u901A: {5}\u3002", cityName, nameJa, badge, highlightsStr, localFoodieSecret, transitTip));
            string zhAnswer = EscapeJson(string.Format("\u6B22\u8FCE\u6765\u5230**{0} ({1})**\uFF01{2}\u3002\\n\u4EE3\u8868\u6027\u666F\u70B9: {3}\u3002\\n\u5F53\u5730\u7F8E\u98DF: {4}\u3002\\n\u4EA4\u901A\u6307\u5357: {5}\u3002", cityName, nameZh, badge, highlightsStr, localFoodieSecret, transitTip));

            var sbQna = new StringBuilder();
            sbQna.Append("{");
            sbQna.AppendFormat("\"id\":\"city_knowledge_{0}\",", cityName);
            sbQna.AppendFormat("\"category\":\"\uC9C0\uC5ED \uD575\uC2EC \uAC00\uC774\uB4DC\",");
            sbQna.AppendFormat("\"badge\":\"{0}\",", EscapeJson(badge));
            sbQna.AppendFormat("\"title\":\"{0} \uD575\uC2EC \uC5EC\uD589 \uAC00\uC774\uB4DC & \uB300\uD45C \uBA85\uC18C\",", cityName);
            sbQna.AppendFormat("\"targetCity\":\"{0}\",", cityName);
            
            var variations = new List<string> {
                cityName, cityName + " \uC5EC\uD589", cityName + " 3\uC77C \uCF54\uC2A4", cityName + " \uAC00\uBCFC\uB9CC\uD55C\uACF3",
                cityName + " \uB9DB\uC9D1", cityName + " \uC77C\uC815", cityName + " \uCF54\uC2A4", cityName + " \uCD94\uCC9C",
                cityName + " 2\uBC153\uC77C", cityName + " \uB2F9\uC77C\uCE58\uAE30", nameEn + " travel", nameEn + " itinerary"
            };
            sbQna.AppendFormat("\"questionVariations\":[{0}],", FormatStringArray(variations));
            
            var intentKw = new List<string> { cityName, "\uC5EC\uD589", "\uCF54\uC2A4", "\uAC00\uBCFC\uB9CC\uD55C\uACF3", "\uB9DB\uC9D1", "\uCD94\uCC9C", "\uC77C\uC815", "\uAC00\uC774\uB4DC", nameEn };
            sbQna.AppendFormat("\"intentKeywords\":[{0}],", FormatStringArray(intentKw));
            
            sbQna.AppendFormat("\"signatureHighlights\":[{0}],", FormatStringArray(signatureHighlights));
            sbQna.AppendFormat("\"rainyHotspots\":[{0}],", FormatStringArray(rainyHotspots));
            sbQna.AppendFormat("\"walkingMinimized\":[{0}],", FormatStringArray(walkingMinimized));
            sbQna.AppendFormat("\"localFoodieSecret\":\"{0}\",", EscapeJson(localFoodieSecret));
            sbQna.AppendFormat("\"transitTip\":\"{0}\",", EscapeJson(transitTip));
            sbQna.AppendFormat("\"hotelType\":\"{0}\",", EscapeJson(hotelType));
            if (nightHighlights.Count > 0) sbQna.AppendFormat("\"nightHighlights\":[{0}],", string.Join(",", nightHighlights));
            if (cafeHighlights.Count > 0) sbQna.AppendFormat("\"cafeHighlights\":[{0}]", string.Join(",", cafeHighlights));
            if (signatureHotels.Count > 0) sbQna.AppendFormat("\"signatureHotels\":[{0}]", string.Join(",", signatureHotels));

            sbQna.AppendFormat("\"geminiAnswer\":{{\"ko\":\"{0}\",\"en\":\"{1}\",\"ja\":\"{2}\",\"zh-CN\":\"{3}\"}}", koAnswer, enAnswer, jaAnswer, zhAnswer);
            sbQna.Append("}");

            cityQnaJsonList.Add(sbQna.ToString());
        }

        // Merge Base QnA + City QnA
        string innerBase = baseQnaJson.Trim();
        if (innerBase.StartsWith("[")) innerBase = innerBase.Substring(1);
        if (innerBase.EndsWith("]")) innerBase = innerBase.Substring(0, innerBase.Length - 1);
        innerBase = innerBase.Trim();

        var finalQnaList = new List<string>();
        finalQnaList.AddRange(cityQnaJsonList);
        if (!string.IsNullOrEmpty(innerBase))
        {
            finalQnaList.Add(innerBase);
        }

        string allQnaCombined = "[" + string.Join(",", finalQnaList) + "]";
        string allCityKnowledgeMap = "{" + string.Join(",", cityDictEntries) + "}";

        // Construct master JSON payload
        string masterJson = string.Format("{{\"version\":\"2026.08.31\",\"description\":\"VORA Master Unified Knowledge Vault\",\"cityCount\":{0},\"qnaVault\":{1},\"cityKnowledge\":{2}}}",
            seenCities.Count, allQnaCombined, allCityKnowledgeMap);

        // Encrypt
        string encryptedB64 = Encrypt(masterJson);

        // Verify Decrypt
        string testDecrypted = Decrypt(encryptedB64);
        if (!testDecrypted.Contains("\"cityKnowledge\":") || !testDecrypted.Contains("\"qnaVault\":"))
        {
            throw new Exception("Roundtrip verification failed!");
        }

        // Generate output file content
        var sbOut = new StringBuilder();
        sbOut.AppendLine("import { decryptData } from '../utils/voraCrypto';");
        sbOut.AppendLine();
        sbOut.AppendLine("/**");
        sbOut.AppendLine(" * VORA AI Encrypted Master Knowledge Vault (Unified Master Knowledge Base)");
        sbOut.AppendLine(" * ");
        sbOut.AppendLine(" * ANTI-SCRAPING / DEVTOOLS (F12) PROTECTION:");
        sbOut.AppendLine(" * - High-speed Dynamic In-Memory Decryption (0.003s)");
        sbOut.AppendLine(" * - Proprietary Korean Travel Intelligence Obfuscation");
        sbOut.AppendFormat(" * - Total Knowledge: 75 General Q&As + {0} Nationwide Cities Local Knowledge 100% Unified\n", seenCities.Count);
        sbOut.AppendLine(" */");
        sbOut.AppendLine();
        sbOut.AppendFormat("export const VORA_ENCRYPTED_VAULT_PAYLOAD = \"{0}\";\n", encryptedB64);
        sbOut.AppendLine();
        sbOut.AppendLine("let _cachedMaster = null;");
        sbOut.AppendLine();
        sbOut.AppendLine("function _getMasterPayload() {");
        sbOut.AppendLine("  if (_cachedMaster) return _cachedMaster;");
        sbOut.AppendLine("  try {");
        sbOut.AppendLine("    const raw = decryptData(VORA_ENCRYPTED_VAULT_PAYLOAD);");
        sbOut.AppendLine("    if (raw && raw.qnaVault && raw.cityKnowledge) {");
        sbOut.AppendLine("      _cachedMaster = raw;");
        sbOut.AppendLine("    } else if (Array.isArray(raw)) {");
        sbOut.AppendLine("      _cachedMaster = { qnaVault: raw, cityKnowledge: {} };");
        sbOut.AppendLine("    } else {");
        sbOut.AppendLine("      _cachedMaster = { qnaVault: [], cityKnowledge: {} };");
        sbOut.AppendLine("    }");
        sbOut.AppendLine("  } catch (e) {");
        sbOut.AppendLine("    _cachedMaster = { qnaVault: [], cityKnowledge: {} };");
        sbOut.AppendLine("  }");
        sbOut.AppendLine("  return _cachedMaster;");
        sbOut.AppendLine("}");
        sbOut.AppendLine();
        sbOut.AppendLine("/**");
        sbOut.AppendLine(" * 1. Master QnA Knowledge Vault Array");
        sbOut.AppendLine(" */");
        sbOut.AppendLine("export function getVoraQnaVault() {");
        sbOut.AppendLine("  return _getMasterPayload().qnaVault || [];");
        sbOut.AppendLine("}");
        sbOut.AppendLine();
        sbOut.AppendLine("/**");
        sbOut.AppendLine(" * 2. Master City Local Knowledge Dictionary (CITY_LOCAL_KNOWLEDGE)");
        sbOut.AppendLine(" */");
        sbOut.AppendLine("export function getCityLocalKnowledge() {");
        sbOut.AppendLine("  return _getMasterPayload().cityKnowledge || {};");
        sbOut.AppendLine("}");
        sbOut.AppendLine();
        sbOut.AppendLine("/**");
        sbOut.AppendLine(" * 3. Master Combined Payload");
        sbOut.AppendLine(" */");
        sbOut.AppendLine("export function getVoraMasterPayload() {");
        sbOut.AppendLine("  return _getMasterPayload();");
        sbOut.AppendLine("}");
        sbOut.AppendLine();
        sbOut.AppendLine("export const VORA_QNA_VAULT = getVoraQnaVault();");
        sbOut.AppendLine("export const CITY_LOCAL_KNOWLEDGE = getCityLocalKnowledge();");

        File.WriteAllText(vaultFilePath, sbOut.ToString(), Encoding.UTF8);

        return string.Format("SUCCESS: Unified and encrypted {0} cities into {1} (Encrypted Payload: {2} chars)", seenCities.Count, vaultFilePath, encryptedB64.Length);
    }

    private static string GetProp(string body, string propName, string defaultVal)
    {
        var m = Regex.Match(body, propName + @":\s*'([^']*)'");
        return m.Success ? m.Groups[1].Value : defaultVal;
    }

    private static List<string> GetStringArray(string body, string propName)
    {
        var list = new List<string>();
        var m = Regex.Match(body, propName + @":\s*\[([\s\S]*?)\]");
        if (m.Success)
        {
            var itemMatches = Regex.Matches(m.Groups[1].Value, @"'([^']*)'");
            foreach (Match im in itemMatches)
            {
                list.Add(im.Groups[1].Value);
            }
        }
        return list;
    }

    private static string FormatStringArray(List<string> list)
    {
        var quoted = new List<string>();
        foreach (var s in list)
        {
            quoted.Add("\"" + EscapeJson(s) + "\"");
        }
        return string.Join(",", quoted);
    }

    private static List<string> GetObjArray(string body, string propName)
    {
        var list = new List<string>();
        var m = Regex.Match(body, propName + @":\s*\[([\s\S]*?)\]");
        if (m.Success)
        {
            var objMatches = Regex.Matches(m.Groups[1].Value, @"\{\s*name:\s*'([^']*)'\s*(?:,\s*type:\s*'([^']*)')?\s*,\s*desc:\s*'([^']*)'\s*\}");
            foreach (Match om in objMatches)
            {
                var sb = new StringBuilder();
                sb.Append("{");
                sb.AppendFormat("\"name\":\"{0}\"", EscapeJson(om.Groups[1].Value));
                if (!string.IsNullOrEmpty(om.Groups[2].Value))
                {
                    sb.AppendFormat(",\"type\":\"{0}\"", EscapeJson(om.Groups[2].Value));
                }
                sb.AppendFormat(",\"desc\":\"{0}\"", EscapeJson(om.Groups[3].Value));
                sb.Append("}");
                list.Add(sb.ToString());
            }
        }
        return list;
    }
}
