<?php

        $host = 'localhost';
        $db_name = 'f0297453_loginsbase';
        $user_name = 'f0297453_f0297453';
        $user_password = 'antainbeec';

        $connect = mysqli_connect($host, $user_name, $user_password, $db_name);
        mysqli_set_charset($connect, "utf8");

        

if (isset($_POST['form_reg']))
{
  $login = $_POST['login'];
  $email = $_POST['email'];
  $password = md5($_POST['password']);
  $password_1 = md5($_POST['password_1']);

  if (isset($login, $email, $password, $password_1))
    {
        if ($password == $password_1)
          {

            $sql = mysqli_query($connect, "SELECT *  FROM `user` WHERE `email` = '$email'");
            $sql1 = mysqli_query($connect, "SELECT *  FROM `user` WHERE `login` = '$login'");
            if (mysqli_num_rows($sql) == '0' && mysqli_num_rows($sql1) == '0')
              {

                  mysqli_query($connect, "INSERT INTO `user` (`id`, `login`, `first_name`, `email`, `count_of_games`, `signup_time`) VALUES (NULL, '$login', '1', '$email', '1', '1');");

                  setcookie("push", 'Регистрация пройденна успешно!:)', time()+3600, "/");
                  header("Location: http://" . $_SERVER['SERVER_NAME']);
              }
              else
              {
                setcookie("push", 'E-mail или Login уже зарегистрирован!', time()+3600, "/");
                header("Location: http://" . $_SERVER['SERVER_NAME']);
              }
          }
          else
          {
            setcookie("push", 'Пароли не совпадают!', time()+3600, "/");
            header("Location: http://" . $_SERVER['SERVER_NAME']);
          }

     }
     else
     {
       setcookie("push", 'Заполните все поля!', time()+3600, "/");
       header("Location: http://" . $_SERVER['SERVER_NAME']);
     }
}

 ?>