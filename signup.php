<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Регистрация</title>
	<link rel="stylesheet" href="/styles/login.css">
</head>

<body>

<form class="login reg-login" method="post" action="/reg.php">
    <h1>Форма входа</h1>
    <fieldset id="inputs">
        <input name = "login" id="login" type="text" placeholder="Логин" autofocus required>
        <input name = "first_name" id="first_name" type="text" placeholder="Ваше имя" required>
        <input name = "password" id="password" type="password" placeholder="Пароль" required>
        <input name = "password_1" type="password" placeholder="Повторите пароль" required>
        <input name = "email" type="email" placeholder="Электронная почта" required>
    </fieldset>
    <fieldset id="actions">
        <input name = "form_reg" type="submit" class="submit reg-submit" value="ЗАРЕГИСТРИРОВАТЬСЯ">
    </fieldset>
</form>
</body>
</html>
