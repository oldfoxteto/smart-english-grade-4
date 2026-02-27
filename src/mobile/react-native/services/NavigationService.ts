import { CommonActions, NavigationProp } from '@react-navigation/native';

// Navigation Service
class NavigationService {
  private navigator: NavigationProp<any> | null = null;

  setTopLevelNavigator(navigatorRef: NavigationProp<any>) {
    this.navigator = navigatorRef;
  }

  navigate(routeName: string, params?: any) {
    if (this.navigator) {
      this.navigator.dispatch(
        CommonActions.navigate({
          name: routeName,
          params,
        })
      );
    }
  }

  reset(routeName: string, params?: any) {
    if (this.navigator) {
      this.navigator.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routeName, params }],
        })
      );
    }
  }

  goBack() {
    if (this.navigator) {
      this.navigator.dispatch(CommonActions.goBack());
    }
  }

  getCurrentRoute() {
    if (this.navigator) {
      return this.navigator.getCurrentRoute();
    }
    return null;
  }

  replace(routeName: string, params?: any) {
    if (this.navigator) {
      this.navigator.dispatch(
        CommonActions.replace({
          name: routeName,
          params,
        })
      );
    }
  }

  push(routeName: string, params?: any) {
    if (this.navigator) {
      this.navigator.dispatch(
        CommonActions.push({
          name: routeName,
          params,
        })
      );
    }
  }

  pop(count?: number) {
    if (this.navigator) {
      this.navigator.dispatch(
        CommonActions.pop({
          count,
        })
      );
    }
  }

  popToTop() {
    if (this.navigator) {
      this.navigator.dispatch(CommonActions.popToTop());
    }
  }
}

export default new NavigationService();
