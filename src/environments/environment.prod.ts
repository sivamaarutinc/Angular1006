
export const environment = {
  production: true,
  feedbackurl: window["env"]["feedbackurl"] || 'https://survey.forumresearch.com/SE/1/WSW8/',

  // PPD
  // authorityUrlStart: 'https://wsibb2cppd.b2clogin.com/wsibb2cppd.onmicrosoft.com/B2C_1A_NIHL_start_submission/v2.0',
  // authorityUrlContinue: 'https://wsibb2cppd.b2clogin.com/wsibb2cppd.onmicrosoft.com/B2C_1A_NIHL_continue_submission/v2.0',
  // client_id: '2f2e2477-5e0c-4e8d-9548-5857f7c0bc4d',
  // redirect_uri: 'https://ppd.hearing-loss-claim.wsib.ca/auth-callback',
  // redirect_resume_uri: 'https://ppd.hearing-loss-claim.wsib.ca/auth-resume-callback',
  // post_logout_uri: 'https://ppd.hearing-loss-claim.wsib.ca/en/nihl/logout',
  // scope: 'openid offline_access https://wsibb2cppd.onmicrosoft.com/nihlapi/apiaccess',
  // timeOut : 14,

  // DEV EXT
  // authorityUrlStart: window["env"]["authorityUrlStart"] || 'https://wsibdev1.b2clogin.com/wsibdev1.onmicrosoft.com/B2C_1A_NIHL_start_submission/v2.0',
  // authorityUrlContinue: window["env"]["authorityUrlContinue"] || 'https://wsibdev1.b2clogin.com/wsibdev1.onmicrosoft.com/B2C_1A_NIHL_continue_submission/v2.0',
  // client_id:  window["env"]["client_id"] || 'c8cfd969-74ab-4e54-ae1a-6abf793d75fb',
  // redirect_uri: window["env"]["redirect_uri"] || 'https://dev.nihl.wsib.ca/auth-callback',
  // redirect_resume_uri: window["env"]["redirect_resume_uri"] || 'https://dev.nihl.wsib.ca/auth-resume-callback',
  // post_logout_uri: window["env"]["post_logout_uri"] || 'https://dev.nihl.wsib.ca/en/nihl/logout',
  // scope: window["env"]["scope"] || 'openid offline_access https://wsibdev1.onmicrosoft.com/nihlapi/apiaccess',
  // timeOut : 14
  // siteKeyCaptcha: "6LfucM0ZAAAAAOodYOVYVsCkZkNsYNxabi3i6Wn8", // V2 GFT
  // secretKeyCaptcha: '6LfucM0ZAAAAAM6K5dNSRzCzD8EazMkQ83Mo11xg', // V2 GFT
  siteKeyCaptcha: '6Le-oNIZAAAAAPSpqdy4bb6VfY6izUalGSMYH2dj',
  secretKeyCaptcha: '6Le-oNIZAAAAAOgwfFZcHdNGZl2SztizZ5j3QEKb',
  isrecaptcha: true,


  // DEV HARDCODE
  // authorityUrlStart: 'https://wsibdev1.b2clogin.com/wsibdev1.onmicrosoft.com/B2C_1A_NIHL_start_submission/v2.0',
  // authorityUrlContinue:  'https://wsibdev1.b2clogin.com/wsibdev1.onmicrosoft.com/B2C_1A_NIHL_continue_submission/v2.0',
  // client_id:  'c8cfd969-74ab-4e54-ae1a-6abf793d75fb',
  // redirect_uri:  'https://dev.nihl.wsib.ca/auth-callback',
  // redirect_resume_uri: 'https://dev.nihl.wsib.ca/auth-resume-callback',
  // post_logout_uri:  'https://dev.nihl.wsib.ca/en/nihl/logout',
  // scope: 'openid offline_access https://wsibdev1.onmicrosoft.com/nihlapi/apiaccess',
  // timeOut : 14,
  // siteKeyCaptcha: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",


  //DEV EXT V2 
  apiUrl: window.sessionStorage.getItem('apiUrl'),
  authorityUrlStart: window.sessionStorage.getItem('authorityUrlStart'),
  authorityUrlContinue: window.sessionStorage.getItem('authorityUrlContinue'),
  client_id: window.sessionStorage.getItem('client_id'),
  redirect_uri: window.sessionStorage.getItem('redirect_uri'),
  redirect_resume_uri: window.sessionStorage.getItem('redirect_resume_uri'),
  post_logout_uri: window.sessionStorage.getItem('post_logout_uri'),
  scope: window.sessionStorage.getItem('scope'),
  timeOut: parseInt(window.sessionStorage.getItem('timeOut')),
};
