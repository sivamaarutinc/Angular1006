
export const environment = {
  production: true,
  feedbackurl: window["env"]["feedbackurl"] || 'https://survey.forumresearch.com/SE/1/WSW8/',

  // PPD
  authorityUrlStart: 'https://wsibb2cppd.b2clogin.com/wsibb2cppd.onmicrosoft.com/B2C_1A_NIHL_start_submission/v2.0',
  authorityUrlContinue: 'https://wsibb2cppd.b2clogin.com/wsibb2cppd.onmicrosoft.com/B2C_1A_NIHL_continue_submission/v2.0',
  client_id: '2f2e2477-5e0c-4e8d-9548-5857f7c0bc4d',
  redirect_uri: 'https://ppd.hearing-loss-claim.wsib.ca/auth-callback',
  redirect_resume_uri: 'https://ppd.hearing-loss-claim.wsib.ca/auth-resume-callback',
  post_logout_uri: 'https://ppd.hearing-loss-claim.wsib.ca/en/nihl/logout',
  scope: 'openid offline_access https://wsibb2cppd.onmicrosoft.com/nihlapi/apiaccess',
  timeOut : 14
 
};
