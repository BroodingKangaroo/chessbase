<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Вход</title>
	<link rel="stylesheet" href="/styles/login.css">
</head>

<body>

<form class="login">
    <h1>Форма входа</h1>
    <fieldset id="inputs">
        <input id="login" type="text" placeholder="Логин" autofocus required>   
        <input id="password" type="password" placeholder="Пароль" required>
    </fieldset>
    <fieldset id="actions">
        <input type="submit" class="submit" id="submit" value="ВОЙТИ">
        <a href="">Забыли пароль?</a><a href="/signup.php">Регистрация</a>
    </fieldset>
</form>
</body>
</html>