<?php
include 'send.php';
echo $_COOKIE['push']; 
setcookie("push", null, 0, "/");  
 ?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Chessbase</title>
  <link rel="stylesheet" href="./styles/style.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
    integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
</head>

<body style="background-color: white;" data-gr-c-s-loaded="true" cz-shortcut-listen="true">

  <header>
    <div class="container">
      <div class="left-menu">

        <a href="#">
          <i class="fas fa-align-justify menu-item"></i>
        </a>
        <a href="#">
          <i class="fas fa-portrait menu-item"></i>
        </a>
        <a href="#">
          <i class="fas fa-palette menu-item"></i>
        </a>

      </div>
      <div class="right-menu">
        <div class="plus-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70" width="70" height="70">
            <a href="/login.php" target="_blank">
              <defs>

                <path
                  d="M16.34 26.81C16.34 37.85 25.3 46.81 36.34 46.81C47.38 46.81 56.34 37.85 56.34 26.81C56.34 15.77 47.38 6.81 36.34 6.81C25.3 6.81 16.34 15.77 16.34 26.81Z"
                  id="a4lQKwfPs"></path>
                <path d="M35.79 14.19L37.25 14.19L37.25 37.98L35.79 37.98L35.79 14.19Z" id="aCip4SAag"></path>
                <path d="M47.98 25.71L47.98 27.18L24.2 27.18L24.2 25.71L47.98 25.71Z" id="g2pMv7Pn6e"></path>
              </defs>
              <g>
                <g>
                  <g>
                    <g>
                      <filter id="shadow14192198" x="-96.66" y="-106.19" width="266" height="274"
                        filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse">
                        <feFlood></feFlood>
                        <feComposite in2="SourceAlpha" operator="in"></feComposite>
                        <feGaussianBlur stdDeviation="7.07"></feGaussianBlur>
                        <feOffset dx="0" dy="8" result="afterOffset"></feOffset>
                        <feFlood flood-color="#000000" flood-opacity="0.5"></feFlood>
                        <feComposite in2="afterOffset" operator="in"></feComposite>
                        <feMorphology operator="dilate" radius="0"></feMorphology>
                        <feComposite in2="SourceAlpha" operator="out"></feComposite>
                      </filter>
                      <path
                        d="M16.34 26.81C16.34 37.85 25.3 46.81 36.34 46.81C47.38 46.81 56.34 37.85 56.34 26.81C56.34 15.77 47.38 6.81 36.34 6.81C25.3 6.81 16.34 15.77 16.34 26.81Z"
                        id="aMJGd4FNw" fill="white" fill-opacity="1" filter="url(#shadow14192198)"></path>
                    </g>
                    <use class="for-hover" xlink:href="#a4lQKwfPs" opacity="1" fill="#ff7042" fill-opacity="1"></use>
                  </g>
                  <g>
                    <use xlink:href="#aCip4SAag" opacity="1" fill="#ffffff" fill-opacity="1"></use>
                  </g>
                  <g>
                    <use xlink:href="#g2pMv7Pn6e" opacity="1" fill="#ffffff" fill-opacity="1"></use>
                  </g>
                </g>
              </g>
            </a>
          </svg>
        </div>
        <div class="user-profile">
          <div id="rectangle">
            <div id="circle">
            </div>
            <div id="profile-name">
              Joe Doe
            </div>
          </div>

        </div>

      </div>
    </div>
  </header>



  <section id="main">
    <div class="container">

      <!-- <div class="main-block"></div> -->


      <script type="text/javascript" src="/scripts/chess.js"></script>
      <script type="text/javascript">
        var config = {
          pieceDir: 'http://scripts.kislenko.net/genfen2/',
          pieceExt: '.png',
          bitmapWidth: 78,
          bitmapHeight: 78,
          fieldColorWhite: '#f0d9b5',
          fieldColorBlack: '#b58863'
        };
      </script>
      <script type="text/javascript" src="/scripts/chessGui2.js"></script>
      <form name="chessFormId" id="chessFormId">
        <div align="center">
          <div id="chessDivId" style="width:624px">
            <table cellpadding="0px" cellspacing="0px" style="border: 1px solid rgb(0, 0, 0);">
              <tbody>
                <tr>
                  <td title="A8"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/br.png&quot;);">
                  </td>
                  <td title="B8"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bn.png&quot;);">
                  </td>
                  <td title="C8"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bb.png&quot;);">
                  </td>
                  <td title="D8"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bq.png&quot;);">
                  </td>
                  <td title="E8"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bk.png&quot;);">
                  </td>
                  <td title="F8"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bb.png&quot;);">
                  </td>
                  <td title="G8"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bn.png&quot;);">
                  </td>
                  <td title="H8"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/br.png&quot;);">
                  </td>
                </tr>
                <tr>
                  <td title="A7"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bp.png&quot;);">
                  </td>
                  <td title="B7"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bp.png&quot;);">
                  </td>
                  <td title="C7"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bp.png&quot;);">
                  </td>
                  <td title="D7"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bp.png&quot;);">
                  </td>
                  <td title="E7"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bp.png&quot;);">
                  </td>
                  <td title="F7"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bp.png&quot;);">
                  </td>
                  <td title="G7"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bp.png&quot;);">
                  </td>
                  <td title="H7"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/bp.png&quot;);">
                  </td>
                </tr>
                <tr>
                  <td title="A6" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="B6" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="C6" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="D6" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="E6" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="F6" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="G6" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="H6" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                </tr>
                <tr>
                  <td title="A5" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="B5" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="C5" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="D5" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="E5" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="F5" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="G5" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="H5" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                </tr>
                <tr>
                  <td title="A4" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="B4" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="C4" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="D4" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="E4" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="F4" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="G4" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="H4" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                </tr>
                <tr>
                  <td title="A3" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="B3" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="C3" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="D3" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="E3" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="F3" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                  <td title="G3" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);"></td>
                  <td title="H3" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);"></td>
                </tr>
                <tr>
                  <td title="A2" style="width: 78px; height: 78px; background-color: rgb(240, 217, 181);">
                  </td>
                  <td title="B2" style="width: 78px; height: 78px; background-color: rgb(181, 136, 99);">
                  </td>
                  <td title="C2"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wp.png&quot;);">
                  </td>
                  <td title="D2"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wp.png&quot;);">
                  </td>
                  <td title="E2"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wp.png&quot;);">
                  </td>
                  <td title="F2"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wp.png&quot;);">
                  </td>
                  <td title="G2"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wp.png&quot;);">
                  </td>
                  <td title="H2"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wp.png&quot;);">
                  </td>
                </tr>
                <tr>
                  <td title="A1"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wr.png&quot;);">
                  </td>
                  <td title="B1"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wn.png&quot;);">
                  </td>
                  <td title="C1"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wb.png&quot;);">
                  </td>
                  <td title="D1"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wq.png&quot;);">
                  </td>
                  <td title="E1"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wk.png&quot;);">
                  </td>
                  <td title="F1"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wb.png&quot;);">
                  </td>
                  <td title="G1"
                    style="width: 78px; height: 78px; background-color: rgb(181, 136, 99); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wn.png&quot;);">
                  </td>
                  <td title="H1"
                    style="width: 78px; height: 78px; background-color: rgb(240, 217, 181); background-image: url(&quot;http://scripts.kislenko.net/genfen2/wr.png&quot;);">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div style="width: 650px;
    max-height: 150px;
    overflow: auto;"> <?php include 'echo.php'; ?> </div>
          
          
          <form action="send.php" method="get">
              
              
          <p><textarea style="width: 535px;" id="chessDivIdSpan" name="code" style="color:green">rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1</textarea></p>
          <br>
           <input type="submit" name="batton_send" value="Сохранить">
           </form>

          <input id="chessUndoId" type="button" value="Отменить ход" disabled="">
          <input name="btnSetFen" type="button" value="Задать FEN"
            onclick="SetFen('chessDivId', 'chessUndoId', 'notId')">
          <a href="/"><input type="button" value="Сброс"></a>
        </div>
        <table  style="visibility: hidden; position: fixed;" cellspacing="0" cellpadding="0" border="0" align="center" width="700" bgcolor="#CCCCCC">
          <tbody>
            <tr>
              <td>
                <p id="notId"></p>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <script type="text/javascript">
        SetDiagram("chessDivId",
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          "chessUndoId", "notId");
      </script>


    </div>
  </section>

  <footer>
    <div class="container">

    </div>
  </footer>

</body>

</html>