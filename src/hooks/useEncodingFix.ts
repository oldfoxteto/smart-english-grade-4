import { useEffect, useState } from 'react';
import EncodingFix from '../utils/encodingFix';

export const useEncodingFix = () => {
  const [isFixed, setIsFixed] = useState(false);

  const fixText = (text: string): string => {
    const fixed = EncodingFix.fixAll(text);
    setIsFixed(true);
    return fixed;
  };

  const fixResponse = (response: any): any => {
    const fixed = EncodingFix.fixAPIResponse(response);
    setIsFixed(true);
    return fixed;
  };

  const fixProps = (props: any): any => {
    const fixed = EncodingFix.fixComponentProps(props);
    setIsFixed(true);
    return fixed;
  };

  // Auto-fix all text content on mount
  useEffect(() => {
    const fixAllText = () => {
      // Fix all text nodes in the document
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      while (node = walker.nextNode()) {
        if (node.nodeValue && node.nodeValue.trim()) {
          const fixedText = EncodingFix.fixAll(node.nodeValue);
          if (fixedText !== node.nodeValue) {
            node.nodeValue = fixedText;
          }
        }
      }
    };

    // Fix all element attributes
    const fixAttributes = () => {
      const elements = document.querySelectorAll('*');
      elements.forEach(element => {
        Array.from(element.attributes).forEach(attr => {
          if (attr.value && attr.value.includes('ð')) {
            const fixedValue = EncodingFix.fixAll(attr.value);
            element.setAttribute(attr.name, fixedValue);
          }
        });
      });
    };

    // Run fixes
    fixAllText();
    fixAttributes();

    // Set up mutation observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              const fixedText = EncodingFix.fixAll(node.nodeValue || '');
              if (fixedText !== node.nodeValue) {
                node.nodeValue = fixedText;
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const textNodes = node.querySelectorAll('*');
              textNodes.forEach(textNode => {
                Array.from(textNode.attributes).forEach(attr => {
                  if (attr.value && attr.value.includes('ð')) {
                    const fixedValue = EncodingFix.fixAll(attr.value);
                    textNode.setAttribute(attr.name, fixedValue);
                  }
                });
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return { fixText, fixResponse, fixProps, isFixed };
};

export default useEncodingFix;
