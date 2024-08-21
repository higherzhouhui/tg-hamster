import { useIntegration } from '@telegram-apps/react-router-integration';
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initBackButton,
  initInitData,
  initNavigator, useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useMemo } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import { routes } from '@/navigation/routes';
import Footer from './Footer';
import { useDispatch } from 'react-redux';
import { loginReq } from '@/api/common';
import { setUserInfoAction } from '@/redux/slices/userSlice';

export const App: FC = () => {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();
  const [backButton] = initBackButton()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    if (!viewport?.isExpanded) {
      viewport?.expand(); // will expand the Mini App, if it's not
    }
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  // Create a new application navigator and attach it to the browser history, so it could modify
  // it and listen to its changes.
  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const [location, reactNavigator] = useIntegration(navigator);
  // Don't forget to attach the navigator to allow it to control the BackButton state as well
  // as browser history.
  // useEffect(() => {
  //   navigator.attach();
  //   return () => navigator.detach();
  // }, [navigator]);
  useEffect(() => {
    backButton.on('click', () => {
      navigate(-1)
    })
  }, [])

  const login = async () => {
    const initData = initInitData() as any;
    let res: any;
    if (initData && initData.user && initData.user.id) {
      const user = initData.initData.user
      const data = { ...initData.initData, ...user }
      res = await loginReq(data)
    }
    if (res.code == 0) {
      dispatch(setUserInfoAction(res.data))
      localStorage.setItem('authorization', res.data.user_id)
    }
  }

  useEffect(() => {
    login()
  }, [])


  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <div className='layout'>
        <div className='content'>
          <Routes>
            {routes.map((route) => <Route key={route.path} {...route} />)}
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AppRoot>
  );
};
