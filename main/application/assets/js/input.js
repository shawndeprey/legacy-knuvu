function Input()
{
  var self = this;
	self.x = 0;
	self.y = 0;
	self.screenX = 0;
	self.screenY = 0;

  var keyMap = {
    65:'a', 66:'b', 67:'c', 68:'d', 69:'e', 70:'f', 71:'g', 72:'h', 73:'i', 74:'j', 75:'k', 76:'l', 77:'m',
    78:'n', 79:'o', 80:'p', 81:'q', 82:'r', 83:'s', 84:'t', 85:'u', 86:'v', 87:'w', 88:'x', 89:'y', 90:'z',
    37:'left', 38:'up', 39:'right', 40:'down', 32:'space', 17:'ctrl', 18:'alt',
    112:'f1', 113:'f2', 114:'f3', 115:'f4', 116:'f5', 117:'f6', 118:'f7', 119:'f8', 120:'f9', 121:'f10',
    48:'0', 49:'1', 50:'2', 51:'3', 52:'4', 53:'5', 54:'6', 55:'7', 56:'8', 57:'9',
    27:'escape', 8:'backspace', 13:'enter', 16:'shift', 192:'tilde', 187:'plus', 189:'minus',
    188:'comma', 190:'period', 191:'question', 186:'colon', 222:'quote', 219:'lbracket', 221:'rbracket', 220:'backslash'
  };

  window.addEventListener("keydown", function(e){ if(self.keyDownEvent(keyMap[e.keyCode])){e.preventDefault();} });
  window.addEventListener("keyup", function(e){ if(self.keyUpEvent(keyMap[e.keyCode])){e.preventDefault();} });

  this.keyUpEvent = function(k)
  {
    if($('div#page-has-custom-input').length > 0){
      switch(true){
        case /[0-9]/.test(k):{
          return false;
        }
        case /left/.test(k):{
          file.selectDPOALeftOfFocusedDPOA();
          return true;
        }
        case /right/.test(k):{
          file.selectDPOARightOfFocusedDPOA();
          return true;
        }
        case /up/.test(k):{
          file.selectDPOAAboveFocusedDPOA();
          return true;
        }
        case /down/.test(k):{
          file.selectDPOABelowFocusedDPOA();
          return true;
        }
      }
    }
    return false;
  }

  this.keyDownEvent = function(k)
  {
    if($('div#page-has-custom-input').length > 0){
      switch(true){
        case /[0-9]/.test(k):{
          return false;
        }
        case /left/.test(k):{
          return true;
        }
        case /right/.test(k):{
          return true;
        }
        case /up/.test(k):{
          return true;
        }
        case /down/.test(k):{
          return true;
        }
      }
    }
    return false;
  }
}