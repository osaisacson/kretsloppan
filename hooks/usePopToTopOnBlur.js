import { StackActions } from '@react-navigation/native';
import { useEffect } from 'react';

/**
 * usePopToTopOnBlur
 * @param {object} navigationProps
 * @param {string} route
 */
function usePopToTopOnBlur(navigationProps, routeName) {
  useEffect(() => {
    const unsubscribe = navigationProps.addListener('blur', () => {
      const navState = navigationProps.dangerouslyGetState();

      if (navState && navState.routes.length) {
        navState.routes.forEach((route) => {
          const regexPattern = new RegExp(routeName);
          if (regexPattern.test(route.name) && route?.state?.index > 0) {
            navigationProps.dispatch(StackActions.popToTop());
          }
        });
      }
    });

    return unsubscribe;
  }, [navigationProps]);
}

export default usePopToTopOnBlur;
