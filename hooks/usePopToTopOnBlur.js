import { StackActions } from '@react-navigation/native';
import { useEffect } from 'react';

/**
 * matchRouteName
 * @param {string} routeName
 */
function matchRouteName(routeName) {
  const regexPattern = new RegExp(routeName);
  return (route) => regexPattern.test(route.name) && route?.state?.index > 0;
}

/**
 * usePopToTopOnBlur
 * @param {object} navigationProps
 * @param {string} routeName
 */
function usePopToTopOnBlur(navigationProps, routeName) {
  useEffect(() => {
    const unsubscribe = navigationProps.addListener('blur', () => {
      const navState = navigationProps.dangerouslyGetState();

      if (navState && navState.routes.length) {
        const hasMatched = navState.routes.some(matchRouteName(routeName));

        if (hasMatched) {
          navigationProps.dispatch(StackActions.popToTop());
        }
      }
    });

    return unsubscribe;
  }, [navigationProps]);
}

export default usePopToTopOnBlur;
