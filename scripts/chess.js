var WHITE = 0;
var BLACK = 1;

var WHITE_KING_CASTLE = 0x01;
var WHITE_QUEEN_CASTLE = 0x02;
var BLACK_KING_CASTLE = 0x04;
var BLACK_QUEEN_CASTLE = 0x08;

var letterA = 'a';
var digit0 = '0';

function Inc(n) { return (++n); }
function trim(string) { return string.replace (/(^\s+)|(\s+$)/g, ""); }

function BuildPieceNoticeName (piece) {
 switch(piece) {
  case 'p': 
  case 'P': return '';
  case 'n':
  case 'N': return 'N';
  case 'b':
  case 'B': return 'B';
  case 'r':
  case 'R': return 'R';
  case 'q':
  case 'Q': return 'Q';
  case 'k':
  case 'K': return 'K';
  default:  return null;
 }
}

function GetColor(piece)
{
  switch(piece)
  {
      case 'k':
      case 'q':
      case 'r':
      case 'b':
      case 'n':
      case 'p':
        return BLACK;
  }
  return WHITE;
}

function BuildNotation (exInfo) {
 if (typeof(exInfo.castling)!='undefined' && exInfo.castling!='') return exInfo.castling;
 var n=exInfo.pieceName + exInfo.fieldFrom + exInfo.delimiter + exInfo.fieldTo;
 if (typeof(exInfo.promotionName)!= 'undefined') n+=exInfo.promotionName;
 if (exInfo.check) n+='+';
 return n;
}

function BuildFen(position)
{
  var fen = '';
  var skipped = 0;
  for (rank=7; rank>=0; --rank)
  {
    for (file=0; file<8; ++file)
    {
      var piece = position.board[file + 16*rank];
      if (piece == '.')
      {
        ++skipped;
      }
      else {
        if (skipped > 0) fen = fen + skipped;
        skipped = 0;
        fen = fen + piece;
      }
    }
    if (skipped > 0) fen = fen + skipped;
    skipped = 0;
    if (rank != 0) fen = fen + '/';
  }
  
  fen += ' ' + (position.activeSide == WHITE ? 'w' : 'b') + ' ';
  
  if (position.castle == 0)
    fen += '- '
  else  
    fen += ''
      + (position.castle & WHITE_KING_CASTLE ? 'K' : '')  
      + (position.castle & WHITE_QUEEN_CASTLE ? 'Q' : '')  
      + (position.castle & BLACK_KING_CASTLE ? 'k' : '')  
      + (position.castle & BLACK_QUEEN_CASTLE ? 'q' : '')  
      + ' ';
      
  if (position.passant == -1)
    fen += '- '
  else
    fen += ''
      + String.fromCharCode(letterA.charCodeAt(0) + (position.passant % 8))
      + String.fromCharCode(digit0.charCodeAt(0) + 1 + ((position.passant >> 4) % 8))
      + ' ';      

  fen = fen + '0 1';
  return fen;
}

function BuildPosition(fen)
{
  var retValue = new Object();
  retValue.board = Array(0x88);

  var fenIndex = 0;
  var file = 0;
  var rank = 7;
  var kingCount = 0;
  
  var ch;

  var fen = trim(fen);
  for(;;)
  {
    if (fenIndex >= fen.length) break;
    ch = fen.charAt(fenIndex);
    
    if (ch == ' ') break;
    switch(ch)
    {
      case 'k': case 'K':
        ++kingCount;
        if (ch == 'k')
          retValue.blackKing = file + 16*rank;
        else  
          retValue.whiteKing = file + 16*rank;
      case 'q': case 'Q':
      case 'r': case 'R':
      case 'b': case 'B': 
      case 'n': case 'N':
      case 'p': case 'P':
        if (file >= 8) return 'Переполнение в строке FEN, номер символа = ' + Inc(fenIndex);
        retValue.board[file + 16*rank] = ch;
        file = file + 1;
        break;
      case '/':
        if (file != 8) return 'Обнаружен разделитель, но линия не определена полностью в строке FEN, номер символа = ' + Inc(fenIndex);
        if (rank == 0) return 'Обнаружен разделитель, но вся позиция прочитана в строке FEN, номер символа = ' + Inc(fenIndex);
        file = 0;
        rank = rank - 1;
        break;
      case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': 
        for (counterCh = '1'; counterCh <= ch; ++counterCh)
        {
          if (file >= 8) return 'Переполнение в строке FEN, номер символа = ' + Inc(fenIndex);
          retValue.board[file + 16*rank] = '.';
          file = file + 1;
        }  
        break;
      default: 
        return 'Неверный символ "' + ch + '" в строке FEN, номер символа = ' + Inc(fenIndex);
    }
    
    ++fenIndex;
  }
  
  if (typeof(retValue.whiteKing) == 'undefined') 
    return 'Неверная позиция. На доске нет белого короля';
  if (typeof(retValue.blackKing) == 'undefined') 
    return 'Неверная позиция. На доске нет черного короля';
  if (kingCount > 2)
    return 'Неверная позиция. На доске более 2 королей';  
  
  for(;;)
  {
    ++fenIndex;
    if (fenIndex >= fen.length)
    {
      retValue.isValid = false;
      return 'Не указана очередность хода! Добавьте пробел и w (белые) или b (чёрные) к нотации';
    }  
    ch = fen.charAt(fenIndex);
    if (ch == 'w' || ch == 'b') break;
    if (ch != ' ')
      return 'Неверный символ "' + ch + '" в строке FEN, номер символа = ' + Inc(fenIndex);
  }
  
  retValue.activeSide = ch == 'w' ? WHITE : BLACK;
  retValue.isValid = true;
  
  retValue.castle = 0;
  retValue.passant = -1;
  
  for(;;)
  {
    ++fenIndex;
    if (fenIndex >= fen.length)
    {
      retValue.castle = 0x0F;
      return retValue;
    }  
    
    ch = fen.charAt(fenIndex);
    if (ch != ' ') break;
  }  
  
  if (ch != '-')
    for(;;)
    {
      switch(ch)
      {
        case 'K':
          retValue.castle |= WHITE_KING_CASTLE;
          break;            
        case 'k':
          retValue.castle |= BLACK_KING_CASTLE;
          break;            
        case 'Q':
          retValue.castle |= WHITE_QUEEN_CASTLE;
          break;            
        case 'q':
          retValue.castle |= BLACK_QUEEN_CASTLE;
          break;            
        default:  
          return 'Неверный символ "' + ch + '" в строке FEN, номер символа = ' + Inc(fenIndex);
      }
      
      ++fenIndex;
      if (fenIndex >= fen.length) return retValue;
      ch = fen.charAt(fenIndex);
      if (ch == ' ') break;
    }  
    
  for(;;)
  {
    ++fenIndex;
    if (fenIndex >= fen.length)
    {
      retValue.castle = 0x0F;
      return retValue;
    }  
    
    ch = fen.charAt(fenIndex);
    if (ch != ' ') break;
  }  
  
  if (ch != '-')
  {
    var passantFile;
    var passantRank;
    
    switch(ch)
    {
      case 'a': passantFile = 0; break;
      case 'b': passantFile = 1; break;
      case 'c': passantFile = 2; break;
      case 'd': passantFile = 3; break;
      case 'e': passantFile = 4; break;
      case 'f': passantFile = 5; break;
      case 'g': passantFile = 6; break;
      case 'h': passantFile = 7; break;
      default: return 'Неверный символ "' + ch + '" в строке FEN, номер символа = ' + Inc(fenIndex);
    }
    
    ++fenIndex;
    if (fenIndex < fen.length)
    {
      ch = fen.charAt(fenIndex);
      switch(ch)
      {
        case '1': passantRank = 0; break;
        case '2': passantRank = 1; break;
        case '3': passantRank = 2; break;
        case '4': passantRank = 3; break;
        case '5': passantRank = 4; break;
        case '6': passantRank = 5; break;
        case '7': passantRank = 6; break;
        case '8': passantRank = 7; break;
        default: return 'Неверный символ "' + ch + '" в строке FEN, номер символа = ' + Inc(fenIndex);
      }
      
      retValue.passant = passantFile + 16 * passantRank;
    }
  }  

  return retValue;
}

var steps = new Array(0x01, 0x10, -0x01, -0x10, 0x0f, 0x11, -0x0f, -0x11);
var stepPiece = new Array('r', 'r', 'r', 'r', 'b', 'b', 'b', 'b');
var knightSteps = new Array(+14, +18, +31, +33, -14, -18, -31, -33);

function TestCheck(position, color, point)
{
  if (typeof(point) == 'undefined') color = position.activeSide;
  if (typeof(point) == 'undefined') point = color == WHITE ? position.whiteKing : position.blackKing;
  
  var opponentKing = color == WHITE ? 'k' : 'K';
  var opponentQueen = color == WHITE ? 'q' : 'Q';
  var opponentKnight = color == WHITE ? 'n' : 'N';
  var opponentPawn = color == WHITE ? 'p' : 'P';
  
  var tempPoint;
  for (i=0; i<8; ++i)
  {
    var opponentRookOrBishop = color == WHITE ? stepPiece[i] : stepPiece[i].toUpperCase();
    var firstTime = true;

    var tempPoint = point;
    for(;;)
    {
      tempPoint += steps[i];
      if (tempPoint & 0x88) break;
      if (position.board[tempPoint] == opponentQueen) return true;
      if (position.board[tempPoint] == opponentRookOrBishop) return true;
      if (firstTime && position.board[tempPoint] == opponentKing) return true;
      if (position.board[tempPoint] != '.') break;
      firstTime = false;
    }
  }
  
  for (i=0; i<8; ++i)
  {
    var tempPoint = point + knightSteps[i];
    if (tempPoint & 0x88) continue;
    if (position.board[tempPoint] == opponentKnight) return true;
  }
  
  var tempPoint;
  tempPoint = point + (color == WHITE ? + 1 : -1 ) * 15;
  if (!(tempPoint & 0x88))
    if (position.board[tempPoint] == opponentPawn)
      return true;
  tempPoint = point + (color == WHITE ? + 1 : -1 ) * 17;
  if (!(tempPoint & 0x88))
    if (position.board[tempPoint] == opponentPawn)
      return true;
  
  return false;
}

function CheckPawnMove(position, fileFrom, rankFrom, fileTo, rankTo, color, isTaking, exInfo)
{
  var delta = color == WHITE ? +1 : -1;
  var startRank = color == WHITE ? 1 : 6;
  
  if (!isTaking)
  if (position.passant == fileTo + 16*rankTo)
  if (Math.abs(fileFrom - fileTo) == 1)
  if (rankTo - rankFrom == delta)
  {
    exInfo.isSimple = false;
    var myPawn = position.board[fileFrom + 16 * rankFrom];
    var opponentPawn = position.board[position.passant - 16*delta];
    
    position.board[fileTo + 16 * rankTo] = myPawn;
    position.board[fileFrom + 16 * rankFrom] = '.';
    position.board[position.passant - 16*delta] = '.';
    
    if (!TestCheck(position, color)) return true;
    
    position.board[position.passant - 16*delta] = opponentPawn;
    position.board[fileFrom + 16 * rankFrom] = myPawn;
    position.board[fileTo + 16 * rankTo] = '.';
    
    return false;
  }
  
  if (!isTaking)
  {
    if (fileTo != fileFrom) return false;
    if (rankTo - rankFrom != delta) 
    {
      if (rankTo - rankFrom != 2 * delta) return false;
      if (rankFrom != startRank) return false;
      if (position.board[fileFrom + 16*rankFrom + 16*delta] != '.') return false;
      exInfo.passant = fileFrom + 16*rankFrom + 16*delta;
    }
  }
  else {
    if (rankTo - rankFrom != delta) return false;
    if (Math.abs(fileFrom - fileTo) != 1) return false;
  }
  
  exInfo.isPromotion = rankTo == 0 || rankTo == 7;
  if (exInfo.isPromotion) exInfo.promotionField = fileTo+16*rankTo;
  else exInfo.promotionField = -1;
  return true;
}

function CheckKnightMove(position, fileFrom, rankFrom, fileTo, rankTo, color, isTaking, exInfo)
{
  var delta1 = Math.abs(fileFrom-fileTo);
  var delta2 = Math.abs(rankFrom-rankTo);
  return (delta1 == 1 && delta2 == 2) || (delta1 == 2 && delta2 == 1);
}

function CheckStepMove(position, from, to, step)
{
  for(;;)
  {
    from += step;
    if (from & 0x88) return false;
    if (from == to) return true;
    if (position.board[from] != '.') return false;
  }
}

function CheckBishopMove(position, fileFrom, rankFrom, fileTo, rankTo, color, isTaking, exInfo)
{
  var step;

  if (false) return false;
  else if (fileTo > fileFrom && rankTo > rankFrom) step = +0x11; 
  else if (fileTo < fileFrom && rankTo > rankFrom) step = +0x0f; 
  else if (fileTo > fileFrom && rankTo < rankFrom) step = -0x0f; 
  else if (fileTo < fileFrom && rankTo < rankFrom) step = -0x11
  else return false; 
  
  return CheckStepMove(position, fileFrom + 16*rankFrom, fileTo + 16*rankTo, step);
}

function CheckRookMove(position, fileFrom, rankFrom, fileTo, rankTo, color, isTaking, exInfo)
{
  var step;

  if (false) return false;
  else if (fileTo == fileFrom && rankTo > rankFrom) step = +0x10; 
  else if (fileTo == fileFrom && rankTo < rankFrom) step = -0x10; 
  else if (rankTo == rankFrom && fileTo > fileFrom) step = +0x01;
  else if (rankTo == rankFrom && fileTo < fileFrom) step = -0x01;
  else return false;
  
  var retValue = CheckStepMove(position, fileFrom + 16*rankFrom, fileTo + 16*rankTo, step);
  if (color == WHITE && fileFrom == 0 && rankFrom == 0)
    position.castle &= ~WHITE_QUEEN_CASTLE;
  if (color == WHITE && fileFrom == 7 && rankFrom == 0)
    position.castle &= ~WHITE_KING_CASTLE;
  if (color == BLACK && fileFrom == 0 && rankFrom == 7)
    position.castle &= ~BLACK_QUEEN_CASTLE;
  if (color == BLACK && fileFrom == 7 && rankFrom == 7)
    position.castle &= ~BLACK_KING_CASTLE;
  return retValue;
}

function CheckQueenMove(position, fileFrom, rankFrom, fileTo, rankTo, color, isTaking, exInfo)
{
  return false
    || CheckBishopMove(position, fileFrom, rankFrom, fileTo, rankTo, color, isTaking, exInfo)
    || CheckRookMove(position, fileFrom, rankFrom, fileTo, rankTo, color, isTaking, exInfo)
    ;
}

function CheckKingMove(position, fileFrom, rankFrom, fileTo, rankTo, color, isTaking, exInfo)
{
  exInfo.castling = '';
  if (fileFrom == 4)
    switch(fileTo)
    {
      case 6:
        if (color == WHITE)
        {
          if (!(position.castle & WHITE_KING_CASTLE)) return false;
          if (rankFrom != 0) return false;
          if (rankTo != 0) return false;
          if (TestCheck(position, color, 0x04)) return false;
          if (TestCheck(position, color, 0x05)) return false;
          if (TestCheck(position, color, 0x06)) return false;
          if (position.board[0x07] != 'R') return false;
          if (position.board[0x06] != '.') return false;
          if (position.board[0x05] != '.') return false;
          position.castle &= ~WHITE_KING_CASTLE & ~WHITE_QUEEN_CASTLE;
          position.board[0x04] = '.';
          position.board[0x05] = 'R';
          position.board[0x06] = 'K';
          position.board[0x07] = '.';
          exInfo.isSimple = false;
          exInfo.castling = 'O-O';
          return true;
        }
        else {
          if (!(position.castle & BLACK_KING_CASTLE)) return false;
          if (rankFrom != 7) return false;
          if (rankTo != 7) return false;
          if (TestCheck(position, color, 0x74)) return false;
          if (TestCheck(position, color, 0x75)) return false;
          if (TestCheck(position, color, 0x76)) return false;
          if (position.board[0x77] != 'r') return false;
          if (position.board[0x76] != '.') return false;
          if (position.board[0x75] != '.') return false;
          position.castle &= ~BLACK_KING_CASTLE & ~BLACK_QUEEN_CASTLE;
          position.board[0x74] = '.';
          position.board[0x75] = 'r';
          position.board[0x76] = 'k';
          position.board[0x77] = '.';
          exInfo.isSimple = false;
          exInfo.castling = 'O-O';
          return true;
        }
        break;
      case 2:
        if (color == WHITE)
        {
          if (!(position.castle & WHITE_QUEEN_CASTLE)) return false;
          if (rankFrom != 0) return false;
          if (rankTo != 0) return false;
          if (TestCheck(position, color, 0x04)) return false;
          if (TestCheck(position, color, 0x03)) return false;
          if (TestCheck(position, color, 0x02)) return false;
          if (position.board[0x00] != 'R') return false;
          if (position.board[0x01] != '.') return false;
          if (position.board[0x02] != '.') return false;
          if (position.board[0x03] != '.') return false;
          position.castle &= ~WHITE_KING_CASTLE & ~WHITE_QUEEN_CASTLE;
          position.board[0x04] = '.';
          position.board[0x03] = 'R';
          position.board[0x02] = 'K';
          position.board[0x01] = '.';
          position.board[0x00] = '.';
          exInfo.isSimple = false;
          exInfo.castling = 'O-O-O';
          return true;
        }
        else {
          if (!(position.castle & BLACK_QUEEN_CASTLE)) return false;
          if (rankFrom != 7) return false;
          if (rankTo != 7) return false;
          if (TestCheck(position, color, 0x74)) return false;
          if (TestCheck(position, color, 0x73)) return false;
          if (TestCheck(position, color, 0x72)) return false;
          if (position.board[0x70] != 'r') return false;
          if (position.board[0x71] != '.') return false;
          if (position.board[0x72] != '.') return false;
          if (position.board[0x73] != '.') return false;
          position.castle &= ~BLACK_KING_CASTLE & ~BLACK_QUEEN_CASTLE;
          position.board[0x74] = '.';
          position.board[0x73] = 'r';
          position.board[0x72] = 'k';
          position.board[0x71] = '.';
          position.board[0x70] = '.';
          exInfo.castling = 'O-O-O';
          exInfo.isSimple = false;
          return true;
        }
        break;  
    }

  var delta1 = fileFrom - fileTo;
  var delta2 = rankFrom - rankTo;
  if (delta1 == 0 && delta2 == 0) return false;
  if (delta1 != -1 && delta1 != 0 && delta1 != +1) return false;
  if (delta2 != -1 && delta2 != 0 && delta2 != +1) return false;

  if (color == WHITE)
    position.castle &= ~WHITE_KING_CASTLE & ~WHITE_QUEEN_CASTLE;
  else  
    position.castle &= ~BLACK_KING_CASTLE & ~BLACK_QUEEN_CASTLE;
    
  return true;
}

function DoMove(position, fileFrom, rankFrom, fileTo, rankTo, exInfo)
{
  if (!position.isValid) return false;

  if (fileFrom < 0 || fileFrom >= 8) return false;
  if (rankFrom < 0 || rankFrom >= 8) return false;
  if (fileTo < 0 || fileTo >= 8) return false;
  if (rankTo < 0 || rankTo >= 8) return false;

  var piece = position.board[fileFrom + 16*rankFrom];
  var destPiece = position.board[fileTo + 16*rankTo];
  var isTaking = destPiece != '.';
  if (isTaking && GetColor(destPiece) == GetColor(piece)) return false;

  exInfo.isSimple = true;
  exInfo.isPromotion = false;
  exInfo.passant = -1;
  
  var isWhiteKing = false;
  var isBlackKing = false;
  
  var isValidMove;
  switch(piece)
  {
    case 'P': 
      isValidMove = CheckPawnMove(position, fileFrom, rankFrom, fileTo, rankTo, WHITE, isTaking, exInfo);
      break;
    case 'p': 
      isValidMove = CheckPawnMove(position, fileFrom, rankFrom, fileTo, rankTo, BLACK, isTaking, exInfo);
      break;
    case 'N': 
      isValidMove = CheckKnightMove(position, fileFrom, rankFrom, fileTo, rankTo, WHITE, isTaking, exInfo);
      break;
    case 'n': 
      isValidMove = CheckKnightMove(position, fileFrom, rankFrom, fileTo, rankTo, BLACK, isTaking, exInfo);
      break;
    case 'B': 
      isValidMove = CheckBishopMove(position, fileFrom, rankFrom, fileTo, rankTo, WHITE, isTaking, exInfo);
      break;
    case 'b': 
      isValidMove = CheckBishopMove(position, fileFrom, rankFrom, fileTo, rankTo, BLACK, isTaking, exInfo);
      break;
    case 'R': 
      isValidMove = CheckRookMove(position, fileFrom, rankFrom, fileTo, rankTo, WHITE, isTaking, exInfo);
      break;
    case 'r': 
      isValidMove = CheckRookMove(position, fileFrom, rankFrom, fileTo, rankTo, BLACK, isTaking, exInfo);
      break;
    case 'Q': 
      isValidMove = CheckQueenMove(position, fileFrom, rankFrom, fileTo, rankTo, WHITE, isTaking, exInfo);
      break;
    case 'q': 
      isValidMove = CheckQueenMove(position, fileFrom, rankFrom, fileTo, rankTo, BLACK, isTaking, exInfo);
      break;
    case 'K': 
      isValidMove = CheckKingMove(position, fileFrom, rankFrom, fileTo, rankTo, WHITE, isTaking, exInfo);
      isWhiteKing = true;
      break;
    case 'k': 
      isValidMove = CheckKingMove(position, fileFrom, rankFrom, fileTo, rankTo, BLACK, isTaking, exInfo);
      isBlackKing = true;
      break;
    default:
      return false;
  }
  
  if (isValidMove == false) return false;

  var killed = position.board[fileTo + 16*rankTo];  
  if (exInfo.isSimple)
  {
   position.board[fileTo + 16*rankTo] = position.board[fileFrom + 16*rankFrom];
   position.board[fileFrom + 16*rankFrom] = '.';
  }
  var whiteKing = isWhiteKing ? fileTo + 16*rankTo : position.whiteKing;
  var blackKing = isBlackKing ? fileTo + 16*rankTo : position.blackKing;
    
  if (TestCheck(position, position.activeSide, position.activeSide == WHITE ? whiteKing : blackKing))
  {
   position.board[fileFrom + 16*rankFrom] = position.board[fileTo + 16*rankTo];
   position.board[fileTo + 16*rankTo] = killed;
   return false;
  }
    
  position.whiteKing = whiteKing;
  position.blackKing = blackKing;
  
  exInfo.pieceName=BuildPieceNoticeName (position.board[fileTo + 16*rankTo]);
  var s='abcdefgh';
  exInfo.fieldFrom=s.substring(fileFrom,fileFrom+1)+(++rankFrom);
  exInfo.fieldTo=s.substring(fileTo,fileTo+1)+(++rankTo);
  if (killed=='.') exInfo.delimiter='-';
  else exInfo.delimiter='x';
  
  position.activeSide ^= 1;
  position.passant = exInfo.passant;
  
  return true;
}
