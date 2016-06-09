(function($, window, document, navigator, global){
  var rfi = rfi ? rfi : {
    initRFI: function(type){
      knuvu.log('Initializing RFI...');
      rfi.initRFIDate();
      switch(type){
        case 'viewer':{
          rfi.initViewer();
          break;
        }
        case 'builder':{
          rfi.initBuilder();
          break;
        }
        default:{
          knuvu.log('Unrecognized rfi initialization format: ' + type);
        }
      }
    },
    initRFIDate: function(){
      rfi.id = data.id;
      rfi.name = data.name;
      rfi.owner = data.owner;
      rfi.level = data.level;
    },
    initViewer: function(){

    },
    initBuilder: function(){
      var rfi_build = $('div.rfi-builder');
      rfi.buildLevels(rfi_build, rfi.level, '');
    },
    buildLevels: function(rfi_build, obj, level_out){
      var level_save = level_out;
      $.each(obj, function(i){
        level_out = (level_out == '') ? level_out+(i + 1) : level_out+'-'+(i + 1);
        $(rfi_build).append('<div class="rfi-level" id="'+level_out+'"><h3>'+level_out.replace(/-/g, '.')+' <span class="name">'+this.name+'</span></h3></div>');
        if(this.child_type == 'poa'){
          rfi.buildQuestions($(rfi_build).find('div#'+level_out), this.child, level_out);
        } else {
          rfi.buildLevels($(rfi_build).find('div#'+level_out), this.child, level_out);
        }
        level_out = level_save;
      });
    },
    buildQuestions: function(rfi_build, obj, level_out){
      var level_save = level_out;
      $(rfi_build).append('<div class="rfi-level rfi-question-group" id="'+level_out+'_questions"></div>');
      rfi_build = $(rfi_build).find('div#'+level_out+'_questions');
      $.each(obj, function(i){//Each POA
        console.log(this);
        level_out = (level_out == '') ? level_out+(i + 1) : level_out+'-'+(i + 1);
        $(rfi_build).append('<div class="poa" id="'+level_out+'"><h3>'+level_out.replace(/-/g, '.')+' <span class="name poa-name">'+this.name+'</span></h3></div>');
        poa = $(rfi_build).find('div#'+level_out);
        var level_save_2 = level_out;
        var j = 0;
        $.each(this.questions, function(section){//Each Question Category
          j++;
          level_out = (level_out == '') ? level_out+j : level_out+'-'+j;
          $(poa).append('<div class="rfi-question-section" id="'+level_out+'"><h3>'+level_out.replace(/-/g, '.')+' <span class="name poa-section-name">'+knuvu.toTitleCase(section.replace(/_/, ' '))+'</span></h3></div>');
          poa_section = $(poa).find('div#'+level_out);
          var level_save_3 = level_out;
          var k = 0;
          $.each(this, function(){
            k++;
            level_out = (level_out == '') ? level_out+k : level_out+'-'+k;
            $(poa_section).append('<div class="rfi-question" id="'+level_out+'"><p><h3 class="question-label">'+level_out.replace(/-/g, '.')+'</h3> <span class="question"><strong>Question Type: </strong>'+this.type+'<strong>&nbsp;&nbsp;&nbsp;&nbsp;Question: </strong>'+this.q+'</span></p></div>');
            level_out = level_save_3;
          });
          level_out = level_save_2;
        });
        level_out = level_save;
      });
    }
  };
  global.rfi = rfi;
})(jQuery, window, document, navigator, this);

$(document).ready(function() {
  //var i = 20;
  //while(i--){rfi.resize();}
});

$(window).resize(function() {
  //rfi.resize();
});