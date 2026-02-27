// Comprehensive Encoding Fix for Arabic Text and Emoji
export class EncodingFix {
  // Fix all encoding issues
  static fixAll(text: string): string {
    if (!text) return text;
    
    let fixed = text;
    
    // Fix common UTF-8 issues
    fixed = this.fixUTF8Issues(fixed);
    
    // Fix Arabic encoding
    fixed = this.fixArabicEncoding(fixed);
    
    // Fix emoji encoding
    fixed = this.fixEmojiEncoding(fixed);
    
    // Fix double encoding
    fixed = this.fixDoubleEncoding(fixed);
    
    return fixed;
  }
  
  // Fix UTF-8 encoding issues
  private static fixUTF8Issues(input: string): string {
    let result = input;
    
    // Fix common UTF-8 encoding patterns
    const replacements: { [key: string]: string } = {
      'Ã¡': 'á', 'Ã¢': 'â', 'Ã£': 'ã', 'Ã¤': 'ä', 'Ã¥': 'å',
      'Ã¦': 'æ', 'Ã§': 'ç', 'Ã¨': 'è', 'Ã©': 'é', 'Ãª': 'ê',
      'Ã«': 'ë', 'Ã¬': 'ì', 'Ã­': 'í', 'Ã®': 'î', 'Ã¯': 'ï',
      'Ã°': 'ð', 'Ã±': 'ñ', 'Ã²': 'ò', 'Ã³': 'ó', 'Ã´': 'ô',
      'Ãµ': 'õ', 'Ã¶': 'ö', 'Ã·': '÷', 'Ã¸': 'ø', 'Ã¹': 'ù',
      'Ãº': 'ú', 'Ã»': 'û', 'Ã¼': 'ü', 'Ã½': 'ý', 'Ã¾': 'þ',
      'Ã¿': 'ÿ',
      
      // Fix common patterns
      'â€™': "'", 'â€œ': '"', 'â€': '"', 'â€"': '—',
      'â€"': '…', 'â€"': '–', 'Â': ' '
    };
    
    Object.entries(replacements).forEach(([broken, correct]) => {
      result = result.replace(new RegExp(broken, 'g'), correct);
    });
    
    return result;
  }
  
  // Fix Arabic encoding issues
  private static fixArabicEncoding(input: string): string {
    let result = input;
    
    // Fix double-encoded Arabic
    const arabicReplacements: { [key: string]: string } = {
      'Ã˜Â§': 'ا', 'Ã˜Â¨': 'ب', 'Ã˜Âª': 'ت', 'Ã˜Â«': 'ث', 'Ã˜Â¬': 'ج',
      'Ã˜Â­': 'ح', 'Ã˜Â®': 'خ', 'Ã˜Â¯': 'د', 'Ã˜Â°': 'ذ', 'Ã˜Â±': 'ر',
      'Ã˜Â²': 'ز', 'Ã˜Â³': 'س', 'Ã˜Â´': 'ش', 'Ã˜Âµ': 'ص', 'Ã˜Â¶': 'ض',
      'Ã˜Â·': 'ط', 'Ã˜Â¸': 'ظ', 'Ã˜Â¹': 'ع', 'Ã˜Âº': 'غ', 'Ã™Â': 'ف',
      'Ã™Â‚': 'ق', 'Ã™Âƒ': 'ك', 'Ã™Â„': 'ل', 'Ã™Â…': 'م', 'Ã™Â†': 'ن',
      'Ã™Â‡': 'ه', 'Ã™Âˆ': 'و', 'Ã™ÂŠ': 'ى', 'Ã™ÂŠ': 'ي', 'Ã˜Â¡': 'ء',
      'Ã˜Â©': 'ة', 'Ã™â€°': 'ى',
      
      // Fix other Arabic encoding issues
      'Ø§': 'ا', 'Ø¨': 'ب', 'Øª': 'ت', 'Ø«': 'ث', 'Ø¬': 'ج',
      'Ø­': 'ح', 'Ø®': 'خ', 'Ø¯': 'د', 'Ø°': 'ذ', 'Ø±': 'ر',
      'Ø²': 'ز', 'Ø³': 'س', 'Ø´': 'ش', 'Øµ': 'ص', 'Ø¶': 'ض',
      'Ø·': 'ط', 'Ø¸': 'ظ', 'Ø¹': 'ع', 'Øº': 'غ', 'Ù': 'ف',
      'Ù‚': 'ق', 'Ùƒ': 'ك', 'Ù„': 'ل', 'Ù…': 'م', 'Ù†': 'ن',
      'Ù‡': 'ه', 'Ùˆ': 'و', 'ÙŠ': 'ى', 'ÙŠ': 'ي', 'Ø¡': 'ء',
      'Ø©': 'ة', 'Ùâ€°': 'ى'
    };
    
    Object.entries(arabicReplacements).forEach(([broken, correct]) => {
      result = result.replace(new RegExp(broken, 'g'), correct);
    });
    
    return result;
  }
  
  // Fix emoji encoding issues
  private static fixEmojiEncoding(input: string): string {
    let result = input;
    
    // Fix broken emoji patterns using hex codes
    const emojiReplacements: { [key: string]: string } = {
      // Common emoji fixes (using hex representation)
      'F0 9F 94 8C': '🔌', 'F0 9F 94 A5': '🔥', 'F0 9F 94 8E': '🔎',
      'F0 9F 94 A7': '🔧', 'F0 9F 94 A6': '🔦', 'F0 9F 94 A8': '🔨',
      'F0 9F 94 AA': '🔪', 'F0 9F 94 AB': '🔫', 'F0 9F 94 AC': '🔬',
      'F0 9F 94 AD': '🔭', 'F0 9F 94 AE': '🔮', 'F0 9F 94 AF': '🔯',
      'F0 9F 94 B0': '🔰', 'F0 9F 94 B1': '🔱', 'F0 9F 94 B2': '🔲',
      'F0 9F 94 B3': '🔳', 'F0 9F 94 B4': '🔴', 'F0 9F 94 B5': '🔵',
      'F0 9F 94 B6': '🔶', 'F0 9F 94 B7': '🔷', 'F0 9F 94 B8': '🔸',
      'F0 9F 94 B9': '🔹', 'F0 9F 94 BA': '🔺', 'F0 9F 94 BB': '🔻',
      'F0 9F 94 BC': '🔼', 'F0 9F 94 BD': '🔽', 'F0 9F 94 BE': '🔾',
      'F0 9F 94 BF': '🔿',
      
      // More emoji fixes
      'F0 9F 9A 80': '🚀', 'E2 9C 85': '✅', 'E2 9D 8C': '❌',
      'E2 9C A8': '✨', 'F0 9F 8E 89': '🎉', 'F0 9F 8E 8A': '🎊',
      'F0 9F 8E 88': '🎈', 'F0 9F 8E 81': '🎁', 'F0 9F 8E 82': '🎂',
      'F0 9F 8E B0': '🍰', 'F0 9F 8D 95': '🍕', 'F0 9F 8D 94': '🍔',
      'F0 9F 8D 9F': '🍟', 'F0 9F 8D BF': '🍿'
    };
    
    Object.entries(emojiReplacements).forEach(([broken, correct]) => {
      result = result.replace(new RegExp(broken.replace(/ /g, ''), 'g'), correct);
    });
    
    return result;
  }
  
  // Fix double encoding issues
  private static fixDoubleEncoding(input: string): string {
    let result = input;
    
    // Fix patterns like ÃÂÃÂ etc.
    result = result.replace(/Ã[0-9]{1,3}[;Â]?/g, (match) => {
      try {
        return decodeURIComponent(escape(match));
      } catch {
        return match;
      }
    });
    
    // Try to decode and re-encode
    try {
      result = decodeURIComponent(encodeURIComponent(result));
    } catch {
      // If decoding fails, return original
    }
    
    return result;
  }
  
  // Fix API response
  static fixAPIResponse(response: any): any {
    try {
      if (typeof response === 'string') {
        return this.fixAll(response);
      }
      
      if (response && typeof response === 'object') {
        // Fix all string values in the response
        const fixed = JSON.parse(JSON.stringify(response), (key, value) => {
          if (typeof value === 'string') {
            return this.fixAll(value);
          }
          return value;
        });
        
        return fixed;
      }
      
      return response;
    } catch (error) {
      console.error('Error fixing API response:', error);
      return response;
    }
  }
  
  // Fix React component props
  static fixComponentProps(props: any): any {
    if (!props) return props;
    
    const fixed = { ...props };
    Object.keys(fixed).forEach(key => {
      if (typeof fixed[key] === 'string') {
        fixed[key] = this.fixAll(fixed[key]);
      }
    });
    
    return fixed;
  }
}

// React Hook for encoding fixes
export const useEncodingFix = () => {
  const fixText = (text: string) => EncodingFix.fixAll(text);
  const fixResponse = (response: any) => EncodingFix.fixAPIResponse(response);
  const fixProps = (props: any) => EncodingFix.fixComponentProps(props);
  
  return { fixText, fixResponse, fixProps };
};

// Export default
export default EncodingFix;
