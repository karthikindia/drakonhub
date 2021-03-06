function Signup(window, document, translate, 
  userIn, emailIn, passIn, pass2In, messageDiv,
  onStart, onSuccess, onError, useCaptcha) {


var gcap = {}
var gWorking = false

var self = this

// Autogenerated with DRAKON Editor 1.32


function beginCreateUser(userName, email, pass, lump, src, product) {
    // item 289
    var data, url
    // item 290
    if (pass) {
        // item 104
        data = {
        	name : userName,
        	email: email,
        	password: pass,
        	lump: lump,
        	src: src
        }
        // item 102
        url = "/api/create_user"
    } else {
        // item 294
        data = {
        	name : userName,
        	email: email,
        	src: src
        }
        // item 293
        url = "/api/create_user_email"
    }
    // item 407
    if (product) {
        // item 410
        data.product = product
    }
    // item 103
    HtmlUtils.sendPost(
    	url,
    	data,
    	signupSuccess,
    	signupError
    )
}

function getLanguage() {
    // item 229
    var language = gLanguage.toLowerCase()
    var code = language.substring(0, 2)
    // item 230
    if (code == "ru") {
        // item 233
        return "ru"
    } else {
        // item 234
        return "en"
    }
}

function getValue(id) {
    // item 27
    return HtmlUtils.getValue(id + "_edit")
}

function hideError(target) {
    // item 172
    var targetEr = makeErrorName(target)
    var targetPtr = makePtrName(target)
    // item 174
    HtmlUtils.show(targetEr, "none")
    HtmlUtils.show(targetPtr, "none")
    // item 181
    HtmlUtils.setText(targetEr, "")
    // item 332
    var element = document.getElementById(target + "_edit")
    // item 329
    if (element) {
        // item 209
        element.style.border = ""
    }
}

function hideErrors() {
    // item 180
    hideError(userIn)
    hideError(emailIn)
    hideError(passIn)
    hideError(pass2In)
    HtmlUtils.setText(messageDiv, "")
    // item 251
    updateUI()
}

function initCaptcha() {
    // item 236
    if (useCaptcha) {
        // item 235
        var language = getLanguage()
        // item 74
        var script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js?onload=onCaptureLoadCallback&render=explicit&hl=" + language
        document.body.appendChild(script)
    }
}

function makeErrorName(name) {
    // item 144
    return name + "_error"
}

function makePtrName(name) {
    // item 164
    return name + "_ptr"
}

function onCaptureLoadCallback(widget) {
    // item 115
    gcap.widget = widget
    // item 112
    if (gcap.onLoad) {
        // item 116
        var callback = gcap.onLoad
        gcap.onLoad = null
        callback()
    }
}

function reportSignupToCarrot(data) {
    // item 401
    if (window.carrotquest) {
        // item 406
        var payload = {
        	"$email": data.email,
        	"$name": data.name,
        	"$user_id": data.id
        }
        // item 404
        window.carrotquest.track(
        	"$registered",
        	payload
        )
    }
}

function resetCaptcha() {
    // item 200
    if (gcap.widget) {
        // item 199
        gcap.widget.reset()
        gcap.lump = null
    }
}

function showCaptcha() {
    // item 124
    if (gcap.widget) {
        // item 121
        if (gcap.captchaShown) {
            
        } else {
            // item 120
            gcap.captchaShown = true
            HtmlUtils.clear("captcha")
            gcap.widget.render(
            	"captcha",
            	{
            		"sitekey": "6LcMXBATAAAAANlJGQ1jRdMuW4wM_Tb5XJaHLIc_",
            		"callback": verified
            	}
            );
        }
    } else {
        // item 126
        gcap.onLoad = showCaptcha
    }
}

function showFieldError(target, message) {
    // item 206
    var targetEr = makeErrorName(target)
    var targetPtr = makePtrName(target)
    // item 208
    HtmlUtils.show(targetEr, "block")
    HtmlUtils.show(targetPtr, "block")
    // item 207
    message = translate(message)
    HtmlUtils.setText(targetEr, message)
    // item 210
    var element = document.getElementById(target + "_edit")
    element.style.border = "solid 1px red"
    element.style.borderRight = "solid 5px red"
    // item 253
    updateUI()
}

function showGeneralError(message, resetCapOnError) {
    // item 188
    message = translate(message)
    HtmlUtils.setText(messageDiv, message)
    // item 189
    HtmlUtils.show(messageDiv, "block")
    // item 202
    if (resetCapOnError) {
        // item 205
        resetCaptcha()
    }
    // item 254
    updateUI()
}

function signup(src) {
    // item 411
    var product = "team"
    // item 333
    if (Config.EMAIL_SIGNUP) {
        // item 336
        signup_email(src, product)
    } else {
        // item 337
        signup_normal(src, product)
    }
}

function signupError(data) {
    // item 135
    gWorking = false
    // item 50
    onError(data)
    // item 48
    var message
    // item 45
    if (data.error) {
        // item 43
        message = data.error
    } else {
        // item 44
        message = "ERR_CREATE_ACCOUNT_FAIL"
    }
    // item 2120001
    if (message === "ERR_USER_EMAIL_NOT_UNIQUE") {
        // item 221
        showFieldError(
        	emailIn,	
        	message
        )
    } else {
        // item 2120002
        if (message === "ERR_USER_ID_NOT_UNIQUE") {
            // item 220
            showFieldError(
            	userIn,
            	message
            )
        } else {
            // item 49
            showGeneralError(message, false)
        }
    }
}

function signupSuccess(data) {
    // item 134
    gWorking = false
    // item 405
    reportSignupToCarrot(data)
    // item 133
    onSuccess(data)
}

function signup_email(src, product) {
    // item 354
    if (gWorking) {
        
    } else {
        // item 357
        hideErrors()
        // item 361
        var recapResult = "no-captcha"
        // item 341
        var userName = getValue(userIn).trim()
        var email = getValue(emailIn).trim()
        // item 351
        var nameError = Utils.checkSpaceName(
        	userName
        )
        // item 343
        if (nameError) {
            // item 345
            showFieldError(
            	userIn,
            	nameError
            )
        } else {
            // item 346
            if (email) {
                // item 358
                if (Utils.checkEmail(email)) {
                    // item 349
                    onStart()
                    // item 356
                    gWorking = true
                    // item 350
                    beginCreateUser(
                    	userName,
                    	email,
                    	null,
                    	recapResult,
                    	src,
                    	product
                    )
                } else {
                    // item 360
                    showFieldError(
                    	emailIn,	
                    	"ERR_BAD_EMAIL"
                    )
                }
            } else {
                // item 348
                showFieldError(
                	emailIn,	
                	"ERR_EMAIL_EMPTY"
                )
            }
        }
    }
}

function signup_normal(src) {
    // item 384
    if (gWorking) {
        
    } else {
        // item 387
        hideErrors()
        // item 395
        var recapResult = "no-captcha"
        // item 392
        if (useCaptcha) {
            // item 388
            recapResult = grecaptcha.getResponse()
        }
        // item 366
        if (recapResult) {
            // item 365
            var userName = getValue(userIn).trim()
            var email = getValue(emailIn).trim()
            var pass = getValue(passIn);
            var pass2 = getValue(pass2In);
            var passError = Utils.checkPassword(pass, pass2);
            // item 381
            var nameError = Utils.checkSpaceName(
            	userName
            )
            // item 370
            if (nameError) {
                // item 372
                showFieldError(
                	userIn,
                	nameError
                )
            } else {
                // item 373
                if (email) {
                    // item 389
                    if (Utils.checkEmail(email)) {
                        // item 376
                        if (passError) {
                            // item 378
                            showFieldError(
                            	passIn,
                            	passError
                            )
                        } else {
                            // item 379
                            onStart()
                            // item 386
                            gWorking = true
                            // item 380
                            beginCreateUser(
                            	userName,
                            	email,
                            	pass,
                            	recapResult,
                            	src
                            )
                        }
                    } else {
                        // item 391
                        showFieldError(
                        	emailIn,	
                        	"ERR_BAD_EMAIL"
                        )
                    }
                } else {
                    // item 375
                    showFieldError(
                    	emailIn,	
                    	"ERR_EMAIL_EMPTY"
                    )
                }
            }
        } else {
            // item 369
            showGeneralError(
            	"ERR_PROVE_NOT_ROBOT",
            	false
            )
        }
    }
}

function updateUI() {
    // item 248
    if (self.update) {
        // item 247
        self.update()
    }
}

function verified(response) {
    // item 80
    gcap.lump = response
}


initCaptcha()

this.signup = signup
this.onCaptureLoadCallback = onCaptureLoadCallback
this.showCaptcha = showCaptcha

}
