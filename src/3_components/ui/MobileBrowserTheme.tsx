// import { useEffect } from 'react';

// interface ThemeColorProps {
//   theme: 'dark' | 'light';
// }

// export function ThemeColor({ theme }: ThemeColorProps) {
//   useEffect(() => {
//     const color = theme === 'dark' ? '#0a0a23' : '#ffffff';

//     let meta = document.querySelector<HTMLMetaElement>(
//       'meta[name="theme-color"]',
//     );

//     if (!meta) {
//       meta = document.createElement('meta');
//       meta.name = 'theme-color';
//       document.head.appendChild(meta);
//     }

//     meta.content = color;
//   }, [theme]);

//   return null;
// }


// If your theme is controlled by a dark class on the <html> element, 
// you can simplify the component so that you don't need to pass theme at all


import { useEffect } from 'react';

export function ThemeColor() {
  useEffect(() => {
    const updateThemeColor = () => {
      const isDark = document.documentElement.classList.contains('dark');

      const color = isDark ? '#181832' : '#ffffff'; 

      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
      
    };

    // Set the initial browser toolbar color
    updateThemeColor();

    // Watch for dark/light theme changes
    const observer = new MutationObserver(updateThemeColor);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}


    //              main.tsx
    //                 |
    //                 v
    //          <ThemeColor />
    //                 |
    //                 v
    //          useEffect runs
    //                 |
    //                 v
    //    updateThemeColor() executes
    //                 |
    //                 v
    //    Read the HTML <html> element
    //                 |
    //                 v
    //    Does it contain class="dark"?
    //                 |
    //          +------+------+
    //          |             |
    //         YES            NO
    //          |             |
    //          v             v
    //    Color = Navy    Color = White
    //    #0a0a23         #ffffff
    //          |             |
    //          +------+------+
    //                 |
    //                 v
    //    Find meta[name="theme-color"]
    //                 |
    //                 v
    //    Update its content attribute
    //                 |
    //                 v
    //     Mobile browser URL bar
    //     changes to selected color


    //    THEME CHANGE DETECTION
    //    ----------------------

    //    <html> class changes
    //                 |
    //                 v
    //        MutationObserver
    //                 |
    //                 v
    //    updateThemeColor() runs
    //                 |
    //                 v
    //      URL bar color updates
