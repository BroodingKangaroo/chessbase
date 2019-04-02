function get_Id(id) {
  return document.getElementById(id);
}

function CalculateAbsoluteOffset(ctrl) {
  var elem = ctrl;

  var left = 0;
  var top = 0;

  while (elem) {
    left += elem.offsetLeft;
    top += elem.offsetTop;
    elem = elem.offsetParent;
  }

  var retValue = new Object();
  retValue.left = left;
  retValue.top = top;
  return retValue;
}

function AddHandler(object, event, handler) {
  if (typeof object.addEventListener != 'undefined')
    object.addEventListener(event, handler, false);
  else if (typeof object.attachEvent != 'undefined')
    object.attachEvent('on' + event, handler);
  else
    throw "Несовместимый браузер (Incompatible browser)";
}

function RemoveHandler(object, event, handler) {
  if (typeof object.removeEventListener != 'undefined')
    object.removeEventListener(event, handler, false);
  else if (typeof object.detachEvent != 'undefined')
    object.detachEvent('on' + event, handler);
  else
    throw "Несовместимый браузер (Incompatible browser)";
}

function PreventDefault(event) {
  if (typeof (event.preventDefault) != 'undefined')
    event.preventDefault();
}

function GetTarget(e) {
  return typeof (e.target) != 'undefined' ? e.target : e.srcElement;
}

function ParentNode(node) {
  return typeof (node.parentNode) != 'undefined' ? node.parentNode : node.parentElement;
}

function FindParent(ctrl, tagName) {
  var node = ctrl;
  for (;;) {
    if (typeof (node.tagName) != 'string') return null;
    if (node.tagName.toUpperCase() == tagName.toUpperCase()) return node;

    node = ParentNode(node);
    if (node == null) return null;
  }
}

function GetFirstChild(ctrl, tagName) {
  var children = ctrl.getElementsByTagName(tagName);
  return children.length == 0 ? null : children[0];
}

function FindTd(div, file, rank) {
  if (file < 0 || file >= 8) return null;
  if (rank < 0 || rank >= 8) return null;

  var table = GetFirstChild(div, 'TABLE');
  var tbody = GetFirstChild(table, 'TBODY');

  var trArray = tbody.getElementsByTagName('TR');
  if (trArray.length < 8) return null;
  var tr = trArray[7 - rank];

  var tdArray = tr.getElementsByTagName('TD');
  if (tdArray.length < 8) return null;
  return tdArray[file];
}

function ExtractPixelValue(s) {
  var suffix = s.length >= 2 ? s.substr(s.length - 2, 2) : '';
  if (suffix.toLowerCase() == 'px')
    s = s.substr(0, s.length - 2);
  return parseInt(s);
}

function Move(ctrl, deltaX, deltaY) {
  var left = ExtractPixelValue(ctrl.style.left);
  var top = ExtractPixelValue(ctrl.style.top);
  ctrl.style.left = left + deltaX + 'px';
  ctrl.style.top = top + deltaY + 'px';
}

function TdMouseDown(e) {
  var td = FindParent(GetTarget(e), 'TD');
  if (td == null) return;

  PreventDefault(e);

  var div = get_Id(td.divId);
  if (div == null) {
    return;
  }
  var position = div.position;

  if (div.isPromotion) return;

  var piece = position.board[td.file + 16 * td.rank];
  if (piece == '.') return;

  if (GetColor(piece) != position.activeSide) return;

  var imgDiv = document.createElement('div');
  var offset = CalculateAbsoluteOffset(td);
  imgDiv.style.position = 'absolute';
  imgDiv.style.left = offset.left + 'px';
  imgDiv.style.top = offset.top + 'px';
  imgDiv.style.width = config.bitmapWidth + 'px';
  imgDiv.style.height = config.bitmapHeight + 'px';
  imgDiv.style.backgroundImage = td.style.backgroundImage;
  imgDiv.zIndex = 10;

  td.style.backgroundImage = '';
  div.appendChild(imgDiv);

  div.dragTd = td;
  div.dragDiv = imgDiv;
  div.dragLastX = e.clientX;
  div.dragLastY = e.clientY;

  AddHandler(div, 'mousemove', TdMouseMove);
  AddHandler(div, 'mouseup', TdMouseUp);
}

function TdMouseMove(e) {
  PreventDefault(e);

  var node = GetTarget(e);
  for (;;) {
    node = FindParent(node, 'DIV');
    if (typeof (node) == 'indefined') return;
    if (typeof (node.dragTd) != 'undefined') break;
    node = ParentNode(node);
  }

  var div = node;
  Move(div.dragDiv, e.clientX - div.dragLastX, e.clientY - div.dragLastY);
  div.dragLastX = e.clientX;
  div.dragLastY = e.clientY;
}

function PieceClick(e) {
  var img = GetTarget(e);
  var div = img.div;
  if (div.position.activeSide == WHITE) {
    for (point = 0x00; point < 0x08; ++point)
      if (div.position.board[point] == 'p') {
        div.position.board[point] = img.piece;
        break;
      }
  } else {
    for (point = 0x70; point < 0x78; ++point)
      if (div.position.board[point] == 'P') {
        div.position.board[point] = img.piece.toUpperCase();
        break;
      }
  }

  div.removeChild(div.promotionDiv);
  div.isPromotion = false;
  div.promotionDiv = null;
  RefreshPositionDiv(div);
  div.history.push(BuildFen(div.position));
  if (div.exInfo.promotionField > -1) {
    div.exInfo.promotionName = '=' + BuildPieceNoticeName(div.position.board[point]);
    if (TestCheck(div.position, div.position.activeSide)) div.exInfo.check = true;
    else div.exInfo.check = false;
  }
  div.notation.push(BuildNotation(div.exInfo));
  ShowNotation(div.notid, div.notation, div.notationvisibility);
  div.undo.disabled = false;
}

function CreatePromotionTd(div, piece, color) {
  var td = document.createElement('td');
  var img = document.createElement('img');
  img.src = config.pieceDir + (color == WHITE ? 'w' : 'b') + piece + config.pieceExt;
  img.style.cursor = 'pointer';
  img.piece = piece;
  img.div = div;
  AddHandler(img, 'click', PieceClick);
  td.appendChild(img);
  return td;
}

function RunPromotion(div) {
  div.isPromotion = true;

  var offset = CalculateAbsoluteOffset(div);

  var promotionDiv = document.createElement('div');
  promotionDiv.parentDiv = div;

  promotionDiv.style.border = '1px solid #000000';
  promotionDiv.style.backgroundColor = 'White';

  promotionDiv.style.position = 'absolute';
  promotionDiv.style.left = offset.left + config.bitmapWidth / 2 + 'px';
  promotionDiv.style.top = offset.top + config.bitmapHeight / 2 + 'px';

  promotionDiv.innerHTML = 'Выберите фигуру:<BR>';

  var table = document.createElement('table');
  table.cellPadding = '0px';
  table.cellSpacing = '0px';

  var tbody = document.createElement('tbody');
  var tr = document.createElement('tr');

  tr.appendChild(CreatePromotionTd(div, 'q', div.position.activeSide ^ 1));
  tr.appendChild(CreatePromotionTd(div, 'r', div.position.activeSide ^ 1));
  tr.appendChild(CreatePromotionTd(div, 'b', div.position.activeSide ^ 1));
  tr.appendChild(CreatePromotionTd(div, 'n', div.position.activeSide ^ 1));

  tbody.appendChild(tr);
  table.appendChild(tbody);
  promotionDiv.appendChild(table);
  div.appendChild(promotionDiv);

  var tableOffset = CalculateAbsoluteOffset(table);
  var offset = CalculateAbsoluteOffset(promotionDiv);
  promotionDiv.style.width = tableOffset.left - offset.left + table.offsetWidth + 'px';
  promotionDiv.style.height = tableOffset.top - offset.top + table.offsetHeight + 'px';
  div.promotionDiv = promotionDiv;
}

function TdMouseUp(e) {
  PreventDefault(e);

  var node = GetTarget(e);
  for (;;) {
    node = FindParent(node, 'DIV');
    if (typeof (node) == 'undefined') return;
    if (typeof (node.dragTd) != 'undefined') break;
    node = ParentNode(node);
  }

  var div = node;
  Move(div.dragDiv, e.clientX - div.dragLastX, e.clientY - div.dragLastY);
  div.dragLastX = e.clientX;
  div.dragLastY = e.clientY;

  var divOffset = CalculateAbsoluteOffset(div);
  var dragDivOffset = CalculateAbsoluteOffset(div.dragDiv);
  var divMouseLeft = dragDivOffset.left - divOffset.left;
  var divMouseTop = dragDivOffset.top - divOffset.top;
  var x = Math.round(divMouseLeft / config.bitmapWidth);
  var y = Math.round(divMouseTop / config.bitmapHeight);
  var file = x;
  var rank = 7 - y;

  var td;
  var exInfo = new Object();
  var isOk = DoMove(div.position, div.dragTd.file, div.dragTd.rank, file, rank, exInfo);
  if (isOk) {
    if (TestCheck(div.position, div.position.activeSide ^ 1)) exInfo.check = true;
    else exInfo.check = false;
    td = FindTd(div, file, rank);
    ShowFen(get_Id(div.id + 'Span'), div.position);
  } else
    td = div.dragTd;

  td.style.backgroundImage = div.dragDiv.style.backgroundImage;
  div.removeChild(div.dragDiv);

  RemoveHandler(div, 'mousemove', TdMouseMove);
  RemoveHandler(div, 'mouseup', TdMouseUp);

  div.dragTd = null;
  div.dragDiv = null;
  div.dragLastX = null;
  div.dragLastY = null;

  if (isOk) {
    if (exInfo.isPromotion) {
      div.exInfo = exInfo;
      RunPromotion(div);
    } else {
      div.history.push(BuildFen(div.position));
      div.undo.disabled = false;
      div.notation.push(BuildNotation(exInfo));
      ShowNotation(div.notid, div.notation, div.notationvisibility);
    }
  }

  if (!exInfo.isSimple)
    RefreshPositionDiv(div);
}

function BuildPieceFileName(ch) {
  switch (ch) {
    case 'p':
    case 'n':
    case 'b':
    case 'r':
    case 'q':
    case 'k':
      return 'b' + ch;
    case 'P':
    case 'N':
    case 'B':
    case 'R':
    case 'Q':
    case 'K':
      return 'w' + ch.toLowerCase();
    default:
      return null;
  }
}

function ClearElement(elem) {
  while (elem.hasChildNodes())
    elem.removeChild(elem.firstChild);
}

function RefreshPositionDiv(div) {
  var position = div.position;
  ClearElement(div);
  div.isPromotion = false;

  var table = document.createElement('table');
  table.cellPadding = '0px';
  table.cellSpacing = '0px';

  table.style.border = 'solid 1px #000000';

  var tbody = document.createElement('tbody');
  var lineLetter = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H');
  for (y = 0; y < 8; ++y) {
    var tr = document.createElement('tr');

    for (x = 0; x < 8; ++x) {
      var td = document.createElement('td');
      td.divId = div.id;
      td.style.width = config.bitmapWidth + 'px';
      td.style.height = config.bitmapHeight + 'px';

      var rank = 7 - y;
      var file = x;

      td.rank = rank;
      td.file = file;

      if ((file ^ rank) & 1) {
        td.style.backgroundColor = config.fieldColorWhite;
      } else {
        td.style.backgroundColor = config.fieldColorBlack;
      }

      var ch = position.board[file + 16 * rank]
      var filename = BuildPieceFileName(ch);
      if (filename != null)
        td.style.backgroundImage = 'url(' + config.pieceDir + filename + config.pieceExt + ')';
      td.title = lineLetter[x] + '' + (8 - y);
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  tr.appendChild(td);
  tbody.appendChild(tr);
  table.appendChild(tbody);
  div.appendChild(table);

  ShowFen(get_Id(div.id + 'Span'), position);
  if (!div.isMouseDownHandler) {
    AddHandler(div, 'mousedown', TdMouseDown);
    div.isMouseDownHandler = true;
  }
}

function UndoClick(e) {
  var button = GetTarget(e);
  var div = button.div;
  if (div.history.length <= 1) return;
  div.history.pop();
  div.notation.pop();
  var fen = div.history[div.history.length - 1];
  div.position = BuildPosition(fen);
  RefreshPositionDiv(div);
  ShowNotation(div.notid, div.notation, div.notationvisibility);
  button.disabled = div.history.length <= 1;
}

var FEN = '';

function SetDiagram(divId, fen, undoId, notId) {
  var div = get_Id(divId);
  var undo = get_Id(undoId);
  var notid;
  if (typeof (notId) != 'string') {
    notid = document.createElement('p');
    notid.style.visibility = 'hidden';
    div.appendChild(notid);
  } else notid = get_Id(notId);
  var position = BuildPosition(fen);
  if (typeof (position) == 'string') {
    alert('Ошибка: ' + position);
    return;
  }

  ClearElement(div);
  div.position = position;
  RefreshPositionDiv(div);
  div.history = [fen];
  div.notation = new Array();
  div.notationvisibility = notid.style.visibility;
  notid.innerHTML = '';
  if (position.activeSide == BLACK) {
    div.notation.push('...');
    ShowNotation(notid, div.notation, div.notationvisibility);
  }
  div.notid = notid;
  notid.div = div;

  undo.disabled = true;
  div.undo = undo;
  undo.div = div;

  if (!undo.isClickHandler) {
    AddHandler(undo, 'click', UndoClick);
    undo.isClickHandler = true;
  }
  FEN = fen;
}

function SetFen(div, undo, notId) {
  var fen = prompt('Введите нотацию FEN:', '');
  if (typeof (fen) == 'string' && fen != '') {
    SetDiagram(div, fen, undo, notId);
  }
}

function ShowFen(span, position) {
  span.innerHTML = BuildFen(position);
}

function dateFmt() {
  var date = new Date();
  var day = date.getDate();
  if (day < 10) day = '0' + day;
  var month = date.getMonth() + 1;
  if (month < 10) month = '0' + month;
  var year = date.getFullYear();
  return year + '.' + month + '.' + day;
}

function ShowNotation(area, notation, visibility) {
  var startInfo =
    '[FEN "' + FEN + '"]' + '<br>' + "\n" +
    '[Event "Название турнира"]' + '<br>' + "\n" +
    '[Site "Город, страна"]' + '<br>' + "\n" +
    '[Date "' + dateFmt() + '"]' + '<br>' + "\n" +
    '[Round "1"]' + '<br>' + "\n" +
    '[White "Player1"]' + '<br>' + "\n" +
    '[Black "Player2"]' + '<br>' + "\n" +
    '[Result "*"]' + '<br>' + "\n" +
    '';
  if (visibility == 'hidden') return;
  var n = String(notation);
  var h = n.split(',');
  if (h.length < 2 && h[0] == '') {
    area.innerHTML = startInfo;
    return;
  }
  var s = '';
  for (var i = 0; i < h.length; i++) {
    if (i % 2 == 0) {
      if (i > 0) s += ' ';
      if (i % 10 == 0) s += '<br>';
      var j = Math.round((i + 1) / 2);
      s += j + '. ';
    } else s += ' ';
    s += h[i];
  }
  area.innerHTML = startInfo + s;
}