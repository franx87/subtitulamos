//import Vue from 'vue';
import $ from 'jquery';

export function dateDiff(a, b) {
	let utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
	let utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds());

	return Math.floor(utcB - utcA);
}

function toggleAccessForm() {
	let $this = $(this);
	let formType = $this.attr("id");
	let $loginForm = $("#login_form");
	let $loginRegistry = $("#login_registry");
	let $regForm = $("#register_form");
	let $fadingPan = $("#login_registry_fade_pan");

	$fadingPan.toggleClass("hidden", false);

	if (formType == "login") {
		//if Login Form is open and you click on Iniciar Sesion on navigation bar -- close it
		if (!$loginForm.hasClass("hidden") && !$loginRegistry.hasClass("hidden")) {
			$loginRegistry.toggleClass("bounce", false);
			$loginRegistry.toggleClass("bounce_back", true);
			setTimeout(function () {
				$loginRegistry.toggleClass("hidden", true)
				$loginRegistry.toggleClass("bounce", true);
				$loginRegistry.toggleClass("bounce_back", false);
			}, 180);
		}
		//if Login Form is closed, just open it
		else if ($loginRegistry.hasClass("hidden")) {
			$loginRegistry.toggleClass("hidden", false);
			$regForm.toggleClass("hidden", true);
			$loginForm.toggleClass("hidden", false);
		}
		//if Register Form is open and you click on Iniciar Sesion on navigation bar
		else {
			$regForm.toggleClass("sendleft_remove", true);
			setTimeout(function () {
				$regForm.toggleClass("hidden", true);
				$loginForm.toggleClass("hidden", false);
				$loginForm.toggleClass("sendleft", true);
			}, 250);
			setTimeout(function () {
				$regForm.toggleClass("sendleft_remove", false);
				$loginForm.toggleClass("sendleft", false);
			}, 400);
		}
	}
	else if (formType == "register") {
		//if Register Form is open and you click on Registro on navigation bar -- close it
		if (!$regForm.hasClass("hidden") && !$loginRegistry.hasClass("hidden")) {
			$loginRegistry.toggleClass("bounce", false);
			$loginRegistry.toggleClass("bounce_back", true);
			setTimeout(function () {
				$loginRegistry.toggleClass("hidden", true)
				$loginRegistry.toggleClass("bounce", true);
				$loginRegistry.toggleClass("bounce_back", false);
			}, 180);
		}
		//if Login Form is closed, just open it
		else if ($loginRegistry.hasClass("hidden")) {
			$loginForm.toggleClass("hidden", true);
			$loginRegistry.toggleClass("hidden", false);
			$regForm.toggleClass("hidden", false);
		}
		//if Login Form is open and you click on Registro on navigation bar
		else {
			$loginForm.toggleClass("sendleft_remove", true);
			setTimeout(function () {
				$loginForm.toggleClass("hidden", true);
				$regForm.toggleClass("hidden", false);
				$regForm.toggleClass("sendleft", true);
			}, 250);
			setTimeout(function () {
				$loginForm.toggleClass("sendleft_remove", false);
				$regForm.toggleClass("sendleft", false);
			}, 400);
		}
	}
}

function closeLogRegForm() {
	let $loginRegistry = $("#login_registry");
	let $fadingPan = $("#login_registry_fade_pan");

	$fadingPan.toggleClass("fade_out", true);
	setTimeout(function () {
		$fadingPan.toggleClass("hidden", true);
		$fadingPan.toggleClass("fade_out", false);
	}, 580);

	if ($loginRegistry.hasClass("hidden")) {
		$loginRegistry.toggleClass("hidden", false);
	}
	else {
		$loginRegistry.toggleClass("bounce", false);
		$loginRegistry.toggleClass("bounce_back", true);
		setTimeout(function () {
			$loginRegistry.toggleClass("hidden", true)
			$loginRegistry.toggleClass("bounce", true);
			$loginRegistry.toggleClass("bounce_back", false);
		}, 380);
	}
}

function shortNumber(number) {
	if (number > 1000) {
		number = Math.floor(number / 100) / 10;
		number = number + "k";
	}

	return number
}

function shortTime(seconds) {
	if (seconds < 3600) {
		let m = Math.floor(seconds / 60);
		return { number: m, unit: m > 1 ? "minutos" : "minuto" }
	}

	if (seconds < 86400) {
		let h = Math.floor(seconds / 3600);
		return { number: h, unit: h > 1 ? "horas" : "hora" }
	}

	let d = Math.floor(seconds / 86400);
	return { number: d, unit: d > 1 ? "días" : "día" }
}

function cleanShowName(name) {
	return name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/, '');
}

function doLogin(e) {
	e.preventDefault();

	let $loginErrors = $("#login-errors");
	let $notificationBar = $("#display_notification");

	let username = $("#login_username").val().trim();
	let pwd = $("#login_password").val();

	if (!username.length || !pwd.length) {
		$loginErrors.html("Ha ocurrido un error al intentar acceder a la web:");
		$loginErrors.append("<ul><li>Ni el usuario ni la contraseña pueden estar vacíos</li></ul>");
		return;
	}

	let $btnWrapper = $("#login_button");
	let $loginBtn = $btnWrapper.find("button");
	let $loginLoading = $btnWrapper.find("i");

	$loginBtn.toggleClass("hidden", true);
	$loginLoading.toggleClass("hidden", false);
	$loginErrors.html(""); // Clear previous errors, just so it's clearer they're new

	// Login the user via ajax
	$.ajax({
		url: "/login",
		method: "post",
		data: {
			username: username,
			password: pwd,
			remember: $("#login_remember_me").is(":checked")
		}
	}).done(function (data) {
		window.location.reload(true);
	}).fail(function (data) {
		$loginBtn.toggleClass("hidden", false);
		$loginLoading.toggleClass("hidden", true);

		try {
			$loginErrors.html("Ha ocurrido un error al intentar acceder a la web:");
			$loginErrors.append("<ul>");
			let $errList = $loginErrors.find("ul");
			let d = JSON.parse(data.responseText);
			Object.keys(d).forEach(function (k) {
				$errList.append("<li>" + d[k] + "</li>");
			}, this);
		} catch (e) {
			$loginErrors.html("Error desconocido al intentar acceder. Por favor, inténtalo de nuevo.");
		}
	});
}

function closeNotification() {
	let $notificationBar = $("#display_notification");
	$notificationBar.toggleClass("fade_slide_out", true);

	setTimeout(function () {
		$notificationBar.toggleClass("hidden", true).toggleClass("fade_slide_out", false);
	}, 350);
}

function clickReactionsAnimate() {
	let $this = $(this);

	$this.toggleClass("button_bounce_click", true);

	setTimeout(function () {
		$this.toggleClass("button_bounce_click", false);
	}, 500);
}

function register(e) {
	e.preventDefault();

	var $regForm = $('#fregister');

	if (!$regForm[0].checkValidity()) { // If the form is invalid, submit it to display error messages
		$regForm.find(':submit').click();
		return false;
	}

	// Login the user via ajax
	$.ajax({
		url: "/register",
		method: "post",
		data: {
			username: $("#reg_username").val(),
			password: $("#reg_password").val(),
			password_confirmation: $("#reg_password_confirmation").val(),
			email: $("#reg_email").val(),
			terms: $("#reg_terms").val()
		}
	}).done(function (data) {
		window.location.reload(true);
	}).fail(function (data) {
		let $regErrors = $("#reg-errors");
		try {
			$regErrors.html("Se han encontrado los siguientes errores en el registro:");
			$regErrors.append("<ul>");
			let $errList = $regErrors.find("ul");

			let d = JSON.parse(data.responseText);
			Object.keys(d).forEach(function (k) {
				Object.keys(d[k]).forEach(function (k2) {
					$errList.append("<li>" + d[k][k2] + "</li>");
				})

			}, this);
		} catch (e) {
			$regErrors.html("Error desconocido al intentar completar el registro. Por favor, inténtalo de nuevo.");
		}
	});
}

$(function () {
	$("#close_logreg_form, #login_registry_fade_pan").on("click", function () { closeNotification(); closeLogRegForm(); });
	$("#login, #register").on("click", toggleAccessForm);
	$("#login_button .sign_button").on("click", doLogin);
	$("#register_button .sign_button").on("click", register);
	$("#close_notification, #display_notification").on("click", closeNotification);
	$("#incategory_board").on("click", ".love_reaction, .share_reaction", clickReactionsAnimate);

	if (window.openLogin) {
		setTimeout(toggleAccessForm.bind($("#login")), 1500);
	}
});
