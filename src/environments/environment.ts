export const environment = {
  production: false,
  // apiUrl: 'http://localhost:4230',
  apiUrl: 'http://dev.nihl.wsib.ca',

  // apitestUrl: window["env"]["apitestUrl"] || "default",
  feedbackurl: window['env']['feedbackurl'] || 'http://survey.forumresearch.com/SE/Test/?st=5c%2frSqmBrE3%2fwg1VIAHcS2XMtN%2beypniDOWBpH9p1w4%3d&tui=auto',

  // authorityUrlStart:  window['env']['authorityUrlStart'] || 'https://wsibdev1.b2clogin.com/wsibdev1.onmicrosoft.com/B2C_1A_NIHL_start_submission/v2.0',
  // authorityUrlContinue:  window['env']['authorityUrlContinue'] || 'https://wsibdev1.b2clogin.com/wsibdev1.onmicrosoft.com/B2C_1A_NIHL_continue_submission/v2.0',
  // client_id: window['env']['client_id'] || '90caf621-66a6-43ca-a801-b7156b8149f2',
  // redirect_uri: window['env']['redirect_uri'] || 'http://localhost:4230/auth-callback',
  // redirect_resume_uri: window['env']['redirect_resume_uri'] || 'http://localhost:4230/auth-resume-callback',
  // post_logout_uri: window['env']['post_logout_uri'] || 'http://localhost:4230/auth-logout',
  // scope: window['env']['scope'] || 'openid offline_access https://wsibdev1.onmicrosoft.com/nihlapi/apiaccess',
  // timeOut : 14



  // Local
  authorityUrlStart: 'https://wsibdev1.b2clogin.com/wsibdev1.onmicrosoft.com/B2C_1A_NIHL_start_submission/v2.0',
  authorityUrlContinue: 'https://wsibdev1.b2clogin.com/wsibdev1.onmicrosoft.com/B2C_1A_NIHL_continue_submission/v2.0',
  client_id: '90caf621-66a6-43ca-a801-b7156b8149f2',
  redirect_uri: 'http://localhost:4230/auth-callback',
  redirect_resume_uri: 'http://localhost:4230/auth-resume-callback',
  post_logout_uri: 'http://localhost:4230/auth-logout',
  scope: 'openid offline_access https://wsibdev1.onmicrosoft.com/nihlapi/apiaccess',
  timeOut: 14,
  siteKeyCaptcha: '6Le-oNIZAAAAAPSpqdy4bb6VfY6izUalGSMYH2dj',
  secretKeyCaptcha: '6Le-oNIZAAAAAOgwfFZcHdNGZl2SztizZ5j3QEKb',
  isrecaptcha: true,
};
