(function(window) {
    window.env = window.env || {};
    // Environment variables
    window["env"]["feedbackurl"] = '${FEEDBACK_URL}',
    window["env"]["authorityUrlStart"] = '${AUTHORITY_START}',
    window["env"]["authorityUrlContinue"] = '${AUTHORITY_CONTINUE}',
    window["env"]["client_id"] = '${CLIENT_ID}',
    window["env"]["redirect_uri"] = '${REDIRECT_URI}',
    window["env"]["redirect_resume_uri"] = '${REDIRECT_RESUME_URI}',
    window["env"]["post_logout_uri"] = '${POST_LOGOUT_URI}',
    window["env"]["scope"] = '${SCOPE}'
  })(this);