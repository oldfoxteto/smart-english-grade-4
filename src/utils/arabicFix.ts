// Arabic Text Encoding Fix Utility
export class ArabicFix {
  // Fix common encoding issues
  static fixArabicText(text: string): string {
    if (!text) return text;
    
    // Fix common encoding issues
    let fixed = text;
    
    // Fix broken Arabic letters
    const replacements: { [key: string]: string } = {
      'Ã¡': 'á', 'Ã¢': 'â', 'Ã£': 'ã', 'Ã¤': 'ä', 'Ã¥': 'å',
      'Ã¦': 'æ', 'Ã§': 'ç', 'Ã¨': 'è', 'Ã©': 'é', 'Ãª': 'ê',
      'Ã«': 'ë', 'Ã¬': 'ì', 'Ã­': 'í', 'Ã®': 'î', 'Ã¯': 'ï',
      'Ã°': 'ð', 'Ã±': 'ñ', 'Ã²': 'ò', 'Ã³': 'ó', 'Ã´': 'ô',
      'Ãµ': 'õ', 'Ã¶': 'ö', 'Ã·': '÷', 'Ã¸': 'ø', 'Ã¹': 'ù',
      'Ãº': 'ú', 'Ã»': 'û', 'Ã¼': 'ü', 'Ã½': 'ý', 'Ã¾': 'þ',
      'Ã¿': 'ÿ',
      
      // Fix Arabic specific issues
      'Ã˜Â§': 'ا', 'Ã˜Â¨': 'ب', 'Ã˜Âª': 'ت', 'Ã˜Â«': 'ث', 'Ã˜Â¬': 'ج',
      'Ã˜Â­': 'ح', 'Ã˜Â®': 'خ', 'Ã˜Â¯': 'د', 'Ã˜Â°': 'ذ', 'Ã˜Â±': 'ر',
      'Ã˜Â²': 'ز', 'Ã˜Â³': 'س', 'Ã˜Â´': 'ش', 'Ã˜Âµ': 'ص', 'Ã˜Â¶': 'ض',
      'Ã˜Â·': 'ط', 'Ã˜Â¸': 'ظ', 'Ã˜Â¹': 'ع', 'Ã˜Âº': 'غ', 'Ã™Â': 'ف',
      'Ã™Â‚': 'ق', 'Ã™Âƒ': 'ك', 'Ã™Â„': 'ل', 'Ã™Â…': 'م', 'Ã™Â†': 'ن',
      'Ã™Â‡': 'ه', 'Ã™Âˆ': 'و', 'Ã™ÂŠ': 'ى', 'Ã˜Â¡': 'ء',
      'Ã˜Â©': 'ة', 'Ã™â€°': 'ى',
      
      // Fix common emoji encoding issues (hex representation)
      'F0 9F 94 8C': '🔌', 'F0 9F 94 A5': '🔥', 'F0 9F 94 8E': '�',
      'F0 9F 94 A7': '🔧', 'F0 9F 94 A6': '�', 'F0 9F 94 A8': '�',
      'F0 9F 94 AA': '�', 'F0 9F 94 AB': '�', 'F0 9F 94 AC': '�',
      'F0 9F 94 AD': '�', 'F0 9F 94 AE': '�', 'F0 9F 94 AF': '�',
      'F0 9F 94 B0': '�', 'F0 9F 94 B1': '�', 'F0 9F 94 B2': '�',
      'F0 9F 94 B3': '�', 'F0 9F 94 B4': '�', 'F0 9F 94 B5': '�',
      'F0 9F 94 B6': '�', 'F0 9F 94 B7': '�', 'F0 9F 94 B8': '�',
      'F0 9F 94 B9': '�', 'F0 9F 94 BA': '�', 'F0 9F 94 BB': '�',
      'F0 9F 94 BC': '�', 'F0 9F 94 BD': '�', 'F0 9F 94 BE': '�',
      'F0 9F 94 BF': '�',
      
      // Common Arabic emoji fixes
      'F0 9F 9A 80': '🚀', 'E2 9C 85': '✅',
      'E2 9D 8C': '❌', 'E2 9C A8': '✨', 'F0 9F 8E 89': '🎉',
      'F0 9F 8E 8A': '🎊', 'F0 9F 8E 88': '🎈', 'F0 9F 8E 81': '🎁',
      'F0 9F 8E 82': '🎂', 'F0 9F 8E B0': '🍰', 'F0 9F 8D 95': '🍕',
      'F0 9F 8D 94': '🍔', 'F0 9F 8D 9F': '🍟', 'F0 9F 8D BF': '🍿',
      
      // Fix common patterns
      'C3 97': '×', 'C3 B7': '÷',
    };
    
    // Apply replacements
    Object.entries(replacements).forEach(([broken, fixed]) => {
      fixed = fixed.replace(new RegExp(broken, 'g'), fixed);
    });
    
    // Fix double encoding issues
    fixed = fixed.replace(/Ã[0-9]{1,3}[;Â]?/g, (match) => {
      try {
        return decodeURIComponent(escape(match));
      } catch {
        return match;
      }
    });
    
    // Fix UTF-8 encoding issues
    try {
      fixed = decodeURIComponent(encodeURIComponent(fixed));
    } catch {
      // If decoding fails, return original
    }
    
    return fixed;
  }
  
  // Fix Arabic numbers
  static fixArabicNumbers(text: string): string {
    if (!text) return text;
    
    const numberMap: { [key: string]: string } = {
      '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
      '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
    };
    
    return text.replace(/[0-9]/g, (match) => numberMap[match] || match);
  }
  
  // Fix Arabic diacritics
  static fixArabicDiacritics(text: string): string {
    if (!text) return text;
    
    // Remove broken diacritics
    return text.replace(/[Ã][Â][\x80-\xBF]{2}/g, '');
  }
  
  // Fix mixed RTL/LTR text
  static fixMixedText(text: string): string {
    if (!text) return text;
    
    // Add RTL marks for Arabic text
    return text.replace(/[\u0600-\u06FF]+/g, (match) => {
      return `\u202B${match}\u202C`; // RTL embedding
    });
  }
  
  // Comprehensive fix
  static fixAll(text: string): string {
    if (!text) return text;
    
    let fixed = text;
    
    // Apply all fixes
    fixed = this.fixArabicText(fixed);
    fixed = this.fixArabicNumbers(fixed);
    fixed = this.fixArabicDiacritics(fixed);
    fixed = this.fixMixedText(fixed);
    
    return fixed;
  }
  
  // Fix JSON response
  static fixJSONResponse(data: any): any {
    if (typeof data === 'string') {
      return this.fixAll(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.fixJSONResponse(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const fixed: any = {};
      Object.keys(data).forEach(key => {
        const fixedKey = this.fixAll(key);
        fixed[fixedKey] = this.fixJSONResponse(data[key]);
      });
      return fixed;
    }
    
    return data;
  }
  
  // Fix API response
  static fixAPIResponse(response: any): any {
    try {
      if (typeof response === 'string') {
        return this.fixAll(response);
      }
      
      if (response && typeof response === 'object') {
        if (response.data) {
          response.data = this.fixJSONResponse(response.data);
        }
        
        if (response.message) {
          response.message = this.fixAll(response.message);
        }
        
        if (response.error) {
          response.error = this.fixAll(response.error);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error fixing API response:', error);
      return response;
    }
  }
}

// React Hook for Arabic text fixing
export const useArabicFix = () => {
  const fixText = (text: string) => ArabicFix.fixAll(text);
  const fixResponse = (response: any) => ArabicFix.fixAPIResponse(response);
  
  return { fixText, fixResponse };
};

// Export default
export default ArabicFix;
