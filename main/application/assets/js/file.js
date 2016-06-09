var priority = {0:'no-priority', 1:'low-priority', 2:'medium-priority', 3:'high-priority'};
var colors = {0:'#ffe7e7', 1:'#ffe7f6', 2:'#f9e7ff', 3:'#ede7ff', 4:'#e7fcff', 5:'#e7fff1', 6:'#fbffe7', 7:'#fff6e7'};
var mid_range = 1;
var loaded_files = "@";
var nested_queue = [];
var nested_stack = [];
var base_file_id = null;

(function($, window, document, navigator, global){
  var file = file ? file : {
    initFile: function(type, data){
      knuvu.log('Initializing File...');
      switch(type){
        case 'knuvu':{
          file.initKnuvuFile(data);
          break;
        }
        default:{
          knuvu.log('Unrecognized file format: ' + type);
        }
      }
    },
    initKnuvuFile: function(data){
      base_file_id = data.id;
      file.id = data.id;
      file.name = data.name;
      file.owner = data.owner;
      file.sample = data.sample;
      file.meta = data.meta;
      file.competitor = data.competitor;
      file.poa = data.poa;
      file.group = data.group;
      file.discrete_poa = data.discrete_poa;
      file.width = 0;
      file.risk_scale = 0;
      file.fillPageElements(true);
      file.tab = 'general';
      $('input#toggle-risk-checkbox').change(function(){ file.toggleRisk(); });
      $('input#toggle-label-checkbox').change(function(){ file.toggleLabel(); });
      $('input#toggle-nested').change(function(){ file.toggleNested(); });
      //Nested KnuVus
      file.nested = [];
        file.checkForAndAddNestedFiles();
      file.models = [];
        knuvu.loadUserModels();
      knuvu.finishedLoading();
    },
    initNestedKnuvuFile: function(data){
      knuvu.startLoading();
        file.id = data.id;
        file.name = data.name;
        file.owner = data.owner;
        file.sample = data.sample;
        file.meta = data.meta;
        file.competitor = data.competitor;
        file.poa = data.poa;
        file.group = data.group;
        file.discrete_poa = data.discrete_poa;
        file.width = 0;
        file.risk_scale = 0;
        if(data.nested_poa != undefined){
          file.nested_poa = data.nested_poa;
        }
        if(data.nested_poa_html != undefined){
          file.nested_poa_html = data.nested_poa_html;
        }
        file.fillPageElements(false);
        //Nested KnuVus
        file.checkForAndAddNestedFiles();
        knuvu.loadUserModels();
      knuvu.finishedLoading();
    },
    save: function(){
      if(nested_stack.length > 0){
        file.loadModelIntoView(base_file_id, -1, true);
      }
      file.updateScore();
      var file_menu = $('div.file-menu');
      var form = $(file_menu).find('form#general');
      new_file = {};
      new_file.meta = file.meta;
      new_file.competition = file.competitor;
      new_file.poa = file.poa;
      new_file.group = file.group;
      new_file.dpoa = file.discrete_poa;
      $(form).find('input#project-file').val( JSON.stringify(new_file) );
      file.saveNestedModels();
      form.submit();
    },
    saveNestedModels: function(){
      if(file.nested.length > 0){
        var file_menu = $('div.file-menu');
        var general = $(file_menu).find('form#general');
        $.each(file.nested, function(){
          var form = $('<form action="save/knuvu/" method="POST">');
          $(form).append('<input type="text" name="project-name" id="file-name" value="'+this.name+'" />');
          $(form).append('<input type="text" name="project-sample" value="'+this.sample+'" />');
          $(form).append('<input type="checkbox" name="toggle-risk" checked="true">');
          $(form).append('<input type="checkbox" name="toggle-label" checked="true">');
          $(form).append('<input type="hidden" name="project-id" value="'+this.id+'" />');
          $(form).append();
          $(form).append('<input type="hidden" name="project-sample" value="'+this.sample+'" />');
          $(form).append('<input type="hidden" name="email" value="'+$(general).find('input[name="email"]').val()+'" />');
          $(form).append('<input type="hidden" name="password" value="'+$(general).find('input[name="password"]').val()+'" />');
          new_file = {};
          new_file.meta = this.meta;
          new_file.competition = this.competitor;
          new_file.poa = this.poa;
          new_file.group = this.group;
          new_file.dpoa = this.discrete_poa;
          var stringified = JSON.stringify(new_file);
          $(form).append('<input type="hidden" name="project-file" id="project-file" value="'+stringified+'" />');
          var http_data = $(form).serialize().replace('%7B', stringified);
          $.post(base_url+'save/knuvu/', http_data);
        });
      }
    },
    saveAllModels: function(){
      if(nested_stack.length > 0){
        file.loadModelIntoView(base_file_id, -1, true);
      }
      file.updateScore();
      file.saveNestedModels();
      var file_menu = $('div.file-menu');
      var general = $(file_menu).find('form#general');
      var form = $('<form action="save/knuvu/" method="POST">');
      $(form).append('<input type="text" name="project-name" id="file-name" value="'+file.name+'" />');
      $(form).append('<input type="text" name="project-sample" value="'+file.sample+'" />');
      $(form).append('<input type="checkbox" name="toggle-risk" checked="true">');
      $(form).append('<input type="checkbox" name="toggle-label" checked="true">');
      $(form).append('<input type="hidden" name="project-id" value="'+file.id+'" />');
      $(form).append();
      $(form).append('<input type="hidden" name="project-sample" value="'+file.sample+'" />');
      $(form).append('<input type="hidden" name="email" value="'+$(general).find('input[name="email"]').val()+'" />');
      $(form).append('<input type="hidden" name="password" value="'+$(general).find('input[name="password"]').val()+'" />');
      new_file = {};
      new_file.meta = file.meta;
      new_file.competition = file.competitor;
      new_file.poa = file.poa;
      new_file.group = file.group;
      new_file.dpoa = file.discrete_poa;
      var stringified = JSON.stringify(new_file);
      $(form).append('<input type="hidden" name="project-file" id="project-file" value="'+stringified+'" />');
      var http_data = $(form).serialize().replace('%7B', stringified);
      $.post(base_url+'save/knuvu/', http_data);
    },
    loadModelIntoView: function(model_id, group_id, going_up_level, poa_id){
      var content = $('div.internal-file-container');
      var data = {};
      if(!going_up_level){
        nested_stack.push(knuvu.clone(file));
      }
      if(going_up_level && nested_stack.length == 1){

        $(content).html('<div class="competition"><div class="competition-header"><a href="#" class="add-sample" id="add-sample" onclick="file.addSample()">+</a></div><div id="competition-content"></div></div><div class="poa-container"><div class="poa-section"></div></div>');
        data.id = nested_stack[0].id;
        data.name = nested_stack[0].name;
        data.owner = nested_stack[0].owner;
        data.sample = nested_stack[0].sample;
        data.meta = nested_stack[0].meta;
        data.competitor = nested_stack[0].competitor;
        data.poa = nested_stack[0].poa;
        data.group = nested_stack[0].group;
        data.discrete_poa = nested_stack[0].discrete_poa;
        file.clearNestedMenu();
        file.initNestedKnuvuFile(data);
        nested_stack = [];
      } else {
        if(going_up_level){
          index = nested_stack.length - 1;
          var html = file.renderNonFunctionalPoaHtmlString(nested_stack[index-1].nested_poa, nested_stack[index-1], nested_stack[index].nested_poa_html);
          //<span>'+nested_stack[index-1].name+' &rarr; '+nested_stack[index].name+'</span>
          $(content).html('<div class="nested-level-controls"><center><span>Parent</span></center><a href="javascript:file.loadModelIntoView('+nested_stack[index].id+', -1, true, '+nested_stack[index].nested_poa+');">'+html+'</a></div>   <div class="competition"><div class="competition-header"><a href="#" class="add-sample" id="add-sample" onclick="file.addSample()">+</a></div><div id="competition-content"></div></div><div class="poa-container"><div class="poa-section"></div></div>');
          data.id = nested_stack[index].id;
          data.name = nested_stack[index].name;
          data.owner = nested_stack[index].owner;
          data.sample = nested_stack[index].sample;
          data.meta = nested_stack[index].meta;
          data.competitor = nested_stack[index].competitor;
          data.poa = nested_stack[index].poa;
          data.group = nested_stack[index].group;
          data.discrete_poa = nested_stack[index].discrete_poa;
          file.initNestedKnuvuFile(data);
          file.clearNestedMenu();
          knuvu.popArray(nested_stack, index);
        } else {
          for(var i = 0; i < file.nested.length; i++){
            if(file.nested[i].id == model_id){
              index = nested_stack.length - 1;
              var html = file.renderNonFunctionalPoaHtmlString(poa_id, file);
              //<span>'+nested_stack[index].name+' &rarr; '+file.nested[i].name+'</span>
              $(content).html('<div class="nested-level-controls"><center><span>Parent</span></center><a href="javascript:file.loadModelIntoView('+file.id+', -1, true, '+poa_id+');">'+html+'</a></div>   <div class="competition"><div class="competition-header"><a href="#" class="add-sample" id="add-sample" onclick="file.addSample()">+</a></div><div id="competition-content"></div></div><div class="poa-container"><div class="poa-section"></div></div>');
              data.id = file.nested[i].id;
              data.name = file.nested[i].name;
              data.owner = file.nested[i].owner;
              data.sample = file.nested[i].sample;
              data.meta = file.nested[i].meta;
              data.competitor = file.nested[i].competitor;
              data.poa = file.nested[i].poa;
              data.group = file.nested[i].group;
              data.discrete_poa = file.nested[i].discrete_poa;
              data.nested_poa = poa_id;
              data.nested_poa_html = html;
              file.clearNestedMenu();
              file.initNestedKnuvuFile(data);
              if(group_id != -1){
                for(var i = 0; i < file.group.length; i++){
                  if(file.group[i].id == group_id){
                    file.selectObject('group', 'group_'+file.group[i].name.replace(/\s/g, ""));
                    break;
                  }
                }
              }
              break;
            }
          }
        }
      }
      var i = 5;while(i--){ file.resizeFile(); }
    },
    populateUserModels: function(){
      var user_models = $('div#user-model-feed').html('');
      $.each(file.models, function(){
        if(this.id != file.id){
          $(user_models).append('<div class="model-file" id="model_file_'+this.id+'"><a href="javascript:file.selectModelFile('+this.id+');" class="model-file-ancor">'+this.name+'</div></div>');
          var model_file = $(user_models).find('div#model_file_'+this.id);
          var model_id = this.id;
          $.each(this.groups, function(){
            $(model_file).append('<div class="model-group" id="model_group_'+model_id+'_'+this.id+'"><a href="javascript:file.selectModelGroup('+model_id+','+this.id+');" class="model-group-ancor">'+this.name+'</a></div>');
          });
        }
      });
    },
    selectModelFile: function(id){
      var file_menu = $('div.file-menu').find('div.poa-menu');
      var nested_label = $(file_menu).find('label#nested-model-label').find('span');
      for(var i = 0; i < file.models.length; i++){
        if(file.models[i].id == id){
          var poa_id = $(file_menu).find('input#poa_id').val();
          $(nested_label).html('<a href="javascript:file.loadModelIntoView('+file.models[i].id+', -1, false, '+poa_id+')" class="toggle-model-button">'+file.models[i].name+'</a>');
          $(file_menu).find('input#poa_nested_type').val(1);//Nested File
          $(file_menu).find('input#poa_nested_file_id').val(id);
          $(file_menu).find('input#poa_nested_group_id').val(0);
          break;
        }
      }
    },
    selectModelGroup: function(file_id, group_id){
      var file_menu = $('div.file-menu').find('div.poa-menu');
      var nested_label = $(file_menu).find('label#nested-model-label').find('span');
      for(var i = 0; i < file.models.length; i++){
        if(file.models[i].id == file_id){
          for(var j = 0; j < file.models[i].groups.length; j++){
            if(file.models[i].groups[j].id == group_id){
              var poa_id = $(file_menu).find('input#poa_id').val();
              $(nested_label).html('<a href="javascript:file.loadModelIntoView('+file.models[i].id+', '+file.models[i].groups[j].id+', false, '+poa_id+')" class="toggle-model-button">'+file.models[i].name+' - '+file.models[i].groups[j].name+'</a>');
              $(file_menu).find('input#poa_nested_type').val(2);//Nested Group
              $(file_menu).find('input#poa_nested_file_id').val(file_id);
              $(file_menu).find('input#poa_nested_group_id').val(group_id);
              break;
            }
          }
          break;
        }
      }
    },
    buildNestedModelName: function(poa){
      if(poa.nt == 1){
        for(var i = 0; i < file.models.length; i++){
          if(file.models[i].id == poa.nf){
            return '<a href="javascript:file.loadModelIntoView('+file.models[i].id+', -1, false, '+poa.id+')" class="toggle-model-button">'+file.models[i].name+'</a>';
          }
        }
      } else
      if(poa.nt == 2){
        for(var i = 0; i < file.models.length; i++){
          if(file.models[i].id == poa.nf){
            for(var j = 0; j < file.models[i].groups.length; j++){
              if(file.models[i].groups[j].id == poa.ng){
                return '<a href="javascript:file.loadModelIntoView('+file.models[i].id+', '+file.models[i].groups[j].id+', false, '+poa.id+')" class="toggle-model-button">'+file.models[i].name+' - '+file.models[i].groups[j].name+'</a>';
              }
            }
          }
        }
      }
      return 'none';
    },
    toggleModelMenu: function(){
      var file_menu = $('div.file-menu');
      var model_button = $(file_menu).find('a#toggle_model_button');
      var user_models = $('div#user-model-feed');
      if( $(user_models).hasClass('show') ){
        $(user_models).removeClass('show');
        $(model_button).html('edit');
      } else {
        $(user_models).addClass('show');
        $(model_button).html('finished');
      }
    },
    checkForAndAddNestedFiles: function(){
      $.each(file.poa, function(){
        file.addNestedFilesIfExist(this);
      });
    },
    loadNestedFiles: function(id){
      $.each(file.nested, function(){
        if(this.id == id){
          $.each(this.poa, function(){
            file.addNestedFilesIfExist(this);
          });
        }
      });
    },
    addNestedFilesIfExist: function(poa){
      if(poa.nt > 0){
        nested_queue.push(poa);
        if( !loaded_files.match('@'+poa.nf+'@') ){//Only load the file if we don't have it
          loaded_files += poa.nf+"@";
          knuvu.loadFile(poa.nf, function(f){//This has to happen within an async function to account for load times
            for(var i = 0; i < nested_queue.length; i++){
              if(nested_queue[i].nf == f.id){
                file.updatePOAWithNestedAttributes(nested_queue[i]);
                knuvu.popArray(nested_queue, i);
                i--;
              }
            }
          });
        } else {
          file.updatePOAWithNestedAttributes(poa);
        }
      }
    },
    updatePOAWithNestedAttributes: function(poa){//External files has been loaded for POA, so now lets update the page with the new values
      var knuvu_file = $('div.knuvu-file');
      $.each(file.nested, function(){
        if(this.id == poa.nf){
          var nest = this;
          var meta = nest.meta;
          if(poa.nt == 1){//Nested File

            var poa_section = $(knuvu_file).find('div#poa_'+poa.name.replace(/\s/g, ""));
            $(poa_section).addClass('has-nested');
            var samples = [];
            $.each(file.competitor, function(){//Get Competitors in common between file and nested file
              var sample_temp = this;
              $.each(nest.competitor, function(){
                var competitor_id = this.id;
                if(sample_temp.name.replace(/\s/g, "") == this.name.replace(/\s/g, "")){
                  var score = {};
                  score.competitor = sample_temp.name.replace(/\s/g, "");
                  score.performance = meta.fs[competitor_id].p;
                  score.risk = meta.fs[competitor_id].r;
                  samples.push( score );
                }
              });
            });
            $.each(samples, function(){//Hijack View with nested elements values
              var element_dpoa = $(poa_section).find('div#dpoa_'+poa.name.replace(/\s/g, "")+'_'+this.competitor);
              $(element_dpoa).removeClass('no-performance low-performance medium-performance high-performance').addClass(file.getPerformance(this.performance, poa.rank_by, poa.scale, poa.benchmark, poa.name));
              $(element_dpoa).find('div.risk').removeClass('no-risk low-risk medium-risk high-risk').addClass(file.getRisk(this.risk));
            });

          } else
          if(poa.nt == 2){//Nested Group

            var poa_section = $(knuvu_file).find('div#poa_'+poa.name.replace(/\s/g, ""));
            $(poa_section).addClass('has-nested');
            var samples = [];
            $.each(file.competitor, function(){//Get Competitors in common between file and nested file
              var sample_temp = this;
              $.each(nest.competitor, function(){
                var competitor_id = this.id;
                if(sample_temp.name.replace(/\s/g, "") == this.name.replace(/\s/g, "")){
                  var score = {};
                  score.competitor = sample_temp.name.replace(/\s/g, "");
                  score.performance = meta.gs[poa.ng][competitor_id].p;
                  score.risk = meta.gs[poa.ng][competitor_id].r;
                  samples.push( score );
                }
              });
            });
            $.each(samples, function(){//Hijack View with nested elements values
              var element_dpoa = $(poa_section).find('div#dpoa_'+poa.name.replace(/\s/g, "")+'_'+this.competitor);
              $(element_dpoa).removeClass('no-performance low-performance medium-performance high-performance').addClass(file.getPerformance(this.performance, poa.rank_by, poa.scale, poa.benchmark, poa.name));
              $(element_dpoa).find('div.risk').removeClass('no-risk low-risk medium-risk high-risk').addClass(file.getRisk(this.risk));
            });

          }
        }
      });
    },
    addNestedFile: function(data){
      file.nested.push(data);
      //file.loadNestedFiles(file.nested.last.id);
    },
    fillPageElements: function(fill_general_menu){
      if(fill_general_menu){
        var file_menu = $('div.file-menu');
        $(file_menu).find('input#file-name').val(file.name);
        $(file_menu).find('input#file-sample').val(file.sample);
      }

      var knuvu_file = $('div.knuvu-file');

      var comp = $(knuvu_file).find('div#competition-content');
      $.each(file.competitor, function(){
        $(comp).append('<a href="javascript:file.selectObject(\'sample\', \'sample_'+this.name.replace(/\s/g, "")+'\');"><div class="selectable competitor" id="sample_'+this.name.replace(/\s/g, "")+'">'+this.name+'</div></a>');
      });

      var poa_section = $(knuvu_file).find('div.poa-section');
      $.each(file.group, function(){
        var g = this;
        $(poa_section).append('<div class="group" id="group_'+this.name.replace(/\s/g, "")+'"><a href="#" class="add-poa" id="add-poa-'+this.name.replace(/\s/g, "")+'" onclick="file.addPOA(event)">+</a><a href="javascript:file.selectObject(\'group\', \'group_'+this.name.replace(/\s/g, "")+'\');" id="group_ancor"><div class="group-header">'+this.name+'</div></a></div>');
        var group = $(poa_section).find('div#group_'+this.name.replace(/\s/g, ""));
        $.each(file.poa, function(){
          if(this.group.toUpperCase() == g.name.toUpperCase()){
            var p = this;
            $(group).append('<div class="poa" id="poa_'+this.name.replace(/\s/g, "")+'"><a href="javascript:file.selectObject(\'poa\', \'poa_'+this.name.replace(/\s/g, "")+'\');" id="poa_ancor"><div class="selectable poa-header">'+this.name+'</div></a></div>');
            var point = $(group).find('div#poa_'+this.name.replace(/\s/g, ""));
            var poa_priority_from_sample = priority[this.performance_priority];
            var rank_by = this.rank_by;
            var scale = this.scale;
            var benchmark = this.benchmark;
            $.each(file.competitor, function(i){
              var c = this;
              $.each(file.discrete_poa, function(){
                if(this.poa.toUpperCase() == p.name.toUpperCase() && this.competitor.toUpperCase() == c.name.toUpperCase()){
                  $(point).append('<a href="javascript:file.selectObject(\'dpoa\', \'dpoa_'+this.poa.replace(/\s/g, "")+'_'+this.competitor.replace(/\s/g, "")+'\');" id="ancor_'+this.poa.replace(/\s/g, "")+'_'+this.competitor.replace(/\s/g, "")+'"><div class="selectable discrete-poa '+poa_priority_from_sample+' '+file.getPerformance(this.performance, rank_by, scale, benchmark, this.poa)+'" id="dpoa_'+this.poa.replace(/\s/g, "")+'_'+this.competitor.replace(/\s/g, "")+'"><div class="risk '+file.getRisk(this.performance_risk)+'"></div><p>'+this.performance_label+'</p></div></a>');
                }
              });
            });
          }
        });
      });
      $(poa_section).append('<a href="#" class="add-group" id="add-group" onclick="file.addGroup()">+</a>');
      file.buildSpecialHoverStates();
      file.resizeFile();
      file.checkAndDisableEditButtons();
    },
    resizeFile: function(){
      var knuvu_file = $('div.knuvu-file');
      var comp = $(knuvu_file).find('div.competition');
      var groups = $(knuvu_file).find('div.poa-section').children();
      var extra_width = 8;
      file.width = extra_width;
      $.each(groups, function(){
        file.width += $(this).width() + extra_width;
      });
      file.width += $(comp).width() + extra_width;
      $(knuvu_file).find('div.internal-file-container').width(file.width);
      file.resizeGroups();
    },
    resizeGroups: function(){
      var knuvu_file = $('div.knuvu-file');
      var comp = $(knuvu_file).find('div.competition');
      var groups = $(knuvu_file).find('div.group');
      $(groups).height($(comp).height() + 23);
    },
    checkAndDisableEditButtons: function(){
      var knuvu_file = $('div.knuvu-file');
      if(!edit){
        $(knuvu_file).find('a#add-sample').remove();
        $(knuvu_file).find('a.add-poa').remove();
        $(knuvu_file).find('a#add-group').remove();
      }
    },
    getPerformance: function(base_perf, rank_by, scale, benchmark, poa_name){
      switch(rank_by){
        case 0:{//Absolute
          return file.getPerformanceScale(base_perf, scale);
          break;
        }
        case 1:{//Mean
          return file.getPerformanceScale(file.getPerformanceComparedToMean(base_perf, poa_name), scale);
          break;
        }
        case 2:{//Benchmark
          return file.getPerformanceScale(file.getPerformanceComparedToBenchmark(base_perf, poa_name, benchmark), scale);
          break;
        }
      }

    },
    getPerformanceScale: function(base_perf, scale){
      var perf_scale = {0:"low-performance", 1:"low-performance", 2:"medium-performance", 3:"high-performance"};
      var perf_scale_invert = {0:"high-performance", 1:"high-performance", 2:"medium-performance", 3:"low-performance"};
      switch(scale){
        case 0:{
          return perf_scale[Math.round(base_perf / 3)];
          break;
        }
        case 1:{
          return perf_scale_invert[Math.round(base_perf / 3)];
          break;
        }
        default:{
          return "no-performance";
        }
      }
    },
    getPerformanceComparedToMean: function(base_perf, poa_name){//var mid_range = 1;
      var mean = 0;
      var adjusted_perf = 0;
      $.each(file.discrete_poa, function(){
        if(this.poa.replace(/\s/g, "") == poa_name.replace(/\s/g, "")){
          mean += this.performance;
        }
      });
      mean = mean / file.competitor.length;
      adjusted_perf = (base_perf >= mean + mid_range) ? 10 : (base_perf <= mean - mid_range) ? 1 : (mean + mid_range >= 10) ? (base_perf > mean) ? 10 : 5 : 5;
      return adjusted_perf
    },
    getPerformanceComparedToBenchmark: function(base_perf, poa_name, benchmark){//var mid_range = 1;
      var bench = 0;
      var adjusted_perf = 0;
      $.each(file.discrete_poa, function(){
        if(this.poa.replace(/\s/g, "") == poa_name.replace(/\s/g, "") && this.competitor.replace(/\s/g, "") == benchmark.replace(/\s/g, "")){
          bench += this.performance;
        }
      });
      adjusted_perf = (base_perf >= bench + mid_range) ? 10 : (base_perf <= bench - mid_range) ? 1 : (bench + mid_range >= 10) ? (base_perf > bench) ? 10 : 5 : 5;
      return adjusted_perf
    },
    getRisk: function(base_risk){
      var risk_scale = {0:"no-risk", 1:"low-risk", 2:"medium-risk", 3:"high-risk"};
      switch(file.risk_scale){
        case 0:{
          return risk_scale[base_risk];
          break;
        }
      }
    },
    addGroup: function(){
      var knuvu_file = $('div.knuvu-file');
      var add_button = $(knuvu_file).find('a#add-group');
      file.group.push({id:file.meta.add_id, display_order: file.group.length + 1, name: "Group "+(file.group.length + 1)});
      file.meta.add_id++;
      var key = file.group.length - 1;
      $(add_button).before('<div class="group" id="group_'+file.group[key].name.replace(/\s/g, "")+'"><a href="#" class="add-poa" id="add-poa-'+file.group[key].name.replace(/\s/g, "")+'" onclick="file.addPOA(event)">+</a><a href="javascript:file.selectObject(\'group\', \'group_'+file.group[key].name.replace(/\s/g, "")+'\');" id="group_ancor"><div class="group-header">'+file.group[key].name+'</div></a></div>');
      file.resizeFile();
      file.buildSpecialHoverStates();
    },
    addSample: function(){
      var knuvu_file = $('div.knuvu-file');
      var comp_content = $(knuvu_file).find('div#competition-content');
      var poa_content = $(knuvu_file).find('div.poa-container');
      file.competitor.push({id:file.meta.add_id, display_order: file.competitor.length, name: "Candidate "+(file.competitor.length + 1)});
      file.meta.add_id++;
      var key = file.competitor.length - 1;
      var name = file.competitor[key].name;
      $(comp_content).append('<a href="javascript:file.selectObject(\'sample\', \'sample_'+name.replace(/\s/g, "")+'\');"><div class="selectable competitor" id="sample_'+name.replace(/\s/g, "")+'">'+name+'</div></a>');
      var poa_priority_from_sample = "";
      $(file.poa).each(function(i){
        poa_priority_from_sample = priority[this.performance_priority];
        file.discrete_poa.push({id:file.meta.add_id, poa:this.name, competitor:name, performance:0, performance_risk:0, performance_label:"", cost:0.0, cost_risk:0, cost_label:""});
        file.meta.add_id++;
        var new_dpoa = file.discrete_poa[file.discrete_poa.length - 1];
        var discrete_poa = $(knuvu_file).find('div#poa_'+this.name.replace(/\s/g, ""));
        $(discrete_poa).append('<a href="javascript:file.selectObject(\'dpoa\', \'dpoa_'+new_dpoa.poa.replace(/\s/g, "")+'_'+new_dpoa.competitor.replace(/\s/g, "")+'\');" id="ancor_'+new_dpoa.poa.replace(/\s/g, "")+'_'+new_dpoa.competitor.replace(/\s/g, "")+'"><div class="selectable discrete-poa '+poa_priority_from_sample+' no-performance" id="dpoa_'+new_dpoa.poa.replace(/\s/g, "")+'_'+new_dpoa.competitor.replace(/\s/g, "")+'"><div class="risk no-risk"></div><p></p></div></a>');
        file.updateRankScaleBenchmark(this);
      });
      file.resizeFile();
    },
    addPOA: function(e){
      var knuvu_file = $('div.knuvu-file');
      var group_name = $(e.toElement).attr('id').replace(/add-poa-/g, "");
      $.each(file.group, function(i){
        if(this.name.replace(/\s/g, "") == group_name){
          var g = i;
          var group = $(knuvu_file).find('div#group_'+group_name);
          file.poa.push({id:file.meta.add_id, display_order:file.poa.length, name:"POA "+(file.poa.length + 1), group:this.name, performance_priority:0, cost_priority:0, rank_by:0, scale:0, benchmark:"", "nt":0,"nf":0,"ng":0});
          file.meta.add_id++;
          var poa_name = file.poa[file.poa.length - 1].name;
          $(group).append('<div class="poa" id="poa_'+poa_name.replace(/\s/g, "")+'"><a href="javascript:file.selectObject(\'poa\', \'poa_'+poa_name.replace(/\s/g, "")+'\');" id="poa_ancor"><div class="selectable poa-header">'+poa_name+'</div></a></div>');
          poa = $(group).find('div#poa_'+poa_name.replace(/\s/g, ""));
          var poa_priority_from_sample = priority[0];
          $.each(file.competitor, function(j){
            file.discrete_poa.push({id:file.meta.add_id, poa:poa_name, competitor:this.name, performance:0, performance_risk:0, performance_label:"", cost:0.0, cost_risk:0, cost_label:""});
            file.meta.add_id++;
            dpoa = file.discrete_poa[file.discrete_poa.length - 1];
            $(poa).append('<a href="javascript:file.selectObject(\'dpoa\', \'dpoa_'+dpoa.poa.replace(/\s/g, "")+'_'+dpoa.competitor.replace(/\s/g, "")+'\');" id="ancor_'+dpoa.poa.replace(/\s/g, "")+'_'+dpoa.competitor.replace(/\s/g, "")+'"><div class="selectable discrete-poa '+poa_priority_from_sample+' '+file.getPerformance(0, 0, 0, "", poa_name)+'" id="dpoa_'+dpoa.poa.replace(/\s/g, "")+'_'+dpoa.competitor.replace(/\s/g, "")+'"><div class="risk no-risk"></div><p>'+dpoa.performance_label+'</p></div></a>');
          });
        }
      });
      file.resizeFile();
    },
    renderNonFunctionalPoaHtmlString: function(poa_id, model, html){
      if(html != undefined && html != null){
        return html;
      } else {
        id = parseInt(poa_id);
        var poa = null;
        for(var i = 0; i < model.poa.length; i++){
          if(model.poa[i].id == id){
            poa = model.poa[i];
            break;
          }
        }

        if(poa != null){
          var html = knuvu.clone( $('div#poa_'+poa.name.replace(/\s/g, "")) );
          $(html).html($(html).attr('id', '').find('a').children().removeClass('selectable'));
        }

        return $('<div>').append($('<div class="up-level-poa-container">').append($(html).append('<div class="poa-fade-out">'))).html();
      }
      /*var html = $('<div>').addClass('poa').append($('<div>').addClass('poa-header').html(poa.name));
      $.each(model.competitor, function(){
        var sample = this;
        $.each(model.discrete_poa, function(){
          var dpoa = this;
          if(dpoa.competitor.replace(/\s/g, "") == sample.name.replace(/\s/g, "") && dpoa.poa.replace(/\s/g, "") == poa.name.replace(/\s/g, "")){
            html.append( $('<div>').addClass('discrete-poa '+file.getPerformance(dpoa.performance, poa.rank_by, poa.scale, poa.benchmark, poa.name)).append($('<div>').addClass('risk '+file.getRisk(dpoa.performance_risk))).append($('<p>').html(dpoa.performance_label)) );
          }
        });
      });*/
    },
    changeTab: function(tab){
      if(tab != file.tab){
        file.tab = tab;
        var file_menu = $('div.file-menu');
        var tabs = [$(file_menu).find('div#general'), $(file_menu).find('div#sample'), $(file_menu).find('div#group'), $(file_menu).find('div#poa'), $(file_menu).find('div#dpoa')];
        $.each(tabs, function(){
          if($(this).attr('id') == file.tab){
            $(file_menu).find('a#tab-'+$(this).attr('id')).addClass('selected');
            $(this).fadeIn(250);
          } else {
            $(file_menu).find('a#tab-'+$(this).attr('id')).removeClass('selected');
            $(this).hide();
          }
        });
      }
    },
    buildSpecialHoverStates: function(){
      var knuvu_file = $('div.knuvu-file');
      $(knuvu_file).find('div.group-header').hover(function(){ $(this).parent().parent().addClass('selectable').removeClass('unselected');    },
                                                   function(){ $(this).parent().parent().addClass('unselected'); });
    },
    updateDisplayOrderForm: function(max, objOrder, select){
      /*$(select).html('').removeAttr('disabled');
      while(max--){
        if(max > 0){
          if(max == objOrder){
            $(select).prepend('<option value="'+max+'" selected="selected">'+max+'</option>');
          } else {
            $(select).prepend('<option value="'+max+'">'+max+'</option>');
          }
        }
      }*/
    },
    selectObject: function(type, object_id){
      var file_menu = $('div.file-menu');
      var knuvu_file = $('div.knuvu-file');
      $(knuvu_file).find('*').removeClass('focused');
      $(knuvu_file).find('div#'+object_id).addClass('focused');
      switch(type){

        case 'sample':{ file.changeTab('sample'); var form = $(file_menu).find('form#sample');
          var sample = file.getSample(object_id.replace(/sample_/g, ""));
          if(object_id == 'sample_'+file.competitor[0].name.replace(/\s/g, "")){
            $(form).find('select#display-order').html('').attr('disabled', 'disabled').prepend('<option value="Sample Priority">Sample Priority</option>');
          } else {
            file.updateDisplayOrderForm(file.competitor.length, sample.display_order, $(form).find('select#display-order'));
          }
          $(form).find('input#name').val(sample.name);
          $(form).find('input#sample_name').val(sample.name.replace(/\s/g, ""));
          break;
        }

        case 'group':{ file.changeTab('group'); var form = $(file_menu).find('form#group');
          var group = file.getGroup(object_id.replace(/group_/g, ""));
          file.updateDisplayOrderForm(file.group.length + 1, group.display_order, $(form).find('select#display-order'));
          $(form).find('input#name').val(group.name);
          $(form).find('input#group_name').val(group.name.replace(/\s/g, ""));
          break;
        }

        case 'poa':{ file.changeTab('poa'); var form = $(file_menu).find('form#poa');
          $(file_menu).find('div#poa_menu_upper').fadeIn(250);
          var poa = file.getPOA(object_id.replace(/poa_/g, ""));
          file.updateDisplayOrderForm(file.poa.length + 1, poa.display_order, $(form).find('select#display-order'));
          $(form).find('input#name').val(poa.name);
          $(form).find('select#poa_group').html('');
          $(form).find('select#priority').val(''+poa.performance_priority+'');
          $(form).find('select#rank_by').val(''+poa.rank_by+'');
          $(form).find('select#scale').val(''+poa.scale+'');
          $(form).find('select#benchmark').html('');
          $(file_menu).find('input#poa_nested_type').val(''+poa.nt+'');
          $(file_menu).find('input#poa_nested_file_id').val(''+poa.nf+'');
          $(file_menu).find('input#poa_nested_group_id').val(''+poa.ng+'');
          $(file_menu).find('input#poa_id').val(''+poa.id+'');
          $.each(file.competitor, function(){
            $(form).find('select#benchmark').append('<option value="'+this.name+'">'+this.name+'</option>');
          });
          $(form).find('select#benchmark').val(poa.benchmark);

          $.each(file.group, function(){
            if(this.name.replace(/\s/g, "") == poa.group.replace(/\s/g, "")){
              $(form).find('select#poa_group').append('<option value="'+this.name+'" selected="selected">'+this.name+'</option>');
            } else {
              $(form).find('select#poa_group').append('<option value="'+this.name+'">'+this.name+'</option>');
            }
          });

          $(form).find('input#poa_name').val(poa.name.replace(/\s/g, ""));
          $(form).find('input#poa_group_name').val(poa.group.replace(/\s/g, ""));
          $(form).find('input#priority_original').val(poa.performance_priority);
          $(form).find('input#rank_by_original').val(poa.rank_by);
          $(form).find('input#scale_original').val(poa.scale);
          $(form).find('input#benchmark_original').val(poa.benchmark);
          if(poa.nt == 0){
            if($(form).find('input#toggle-nested').attr("checked") == 'checked'){
              $(form).find('input#toggle-nested').attr("checked", false).trigger('change');
            }
          } else {
            if($(form).find('input#toggle-nested').attr("checked") != 'checked'){
              $(form).find('input#toggle-nested').attr("checked", true).trigger('change');
            }
            var nested_label = $(form).find('label#nested-model-label').find('span');
            $(nested_label).html( file.buildNestedModelName(poa) );
          }
          break;
        }

        case 'dpoa':{ file.changeTab('dpoa'); var form = $(file_menu).find('form#dpoa');
          $(file_menu).find('div#dpoa').fadeIn(250);
          var dpoa = file.getDPOA(object_id.replace(/dpoa_/g, ""));
          var poa = file.getPOA(dpoa.poa);
          var meta =  file.getMetaScoreDPOA(poa, dpoa);
          $(form).find('input#label').val(dpoa.performance_label);
          $(form).find('select#performance').val(''+dpoa.performance+'');
          $(form).find('select#risk').val(''+dpoa.performance_risk+'');

          $(form).find('input#poa').val(dpoa.poa);
          $(form).find('input#sample').val(dpoa.competitor);
          $(form).find('input#label_original').val(dpoa.performance_label);
          $(form).find('input#performance_original').val(dpoa.performance);
          $(form).find('input#risk_original').val(dpoa.performance_risk);

          var nna = $(form).find('div#non-nested-attributes');
          if(meta != null && meta.performance != undefined){
            $(nna).find('select#performance').val(meta.performance).attr('disabled', true);
            $(nna).find('select#risk').val(meta.risk).attr('disabled', true);
          } else {
            $(nna).find('select#performance').attr('disabled', false);
            $(nna).find('select#risk').attr('disabled', false);
          }

          break;
        }

      }
    },
    updateObject: function(type){
      var file_menu = $('div.file-menu');
      var knuvu_file = $('div.knuvu-file');
      switch(type){

        case 'sample':{ var form = $(file_menu).find('form#sample'); var general = $(file_menu).find('form#general');
          if(file.validateName($(form).find('input#name').val(), file.competitor)){
            var sample_machine_name = $(form).find('input#sample_name').val();
            var sample = file.getSample(sample_machine_name);
            if(sample.name == $(general).find('input#file-sample').val()){
              $(general).find('input#file-sample').val($(form).find('input#name').val());
            }
            sample.name = $(form).find('input#name').val();
            $.each(file.poa, function(){
              if(this.benchmark.replace(/\s/g, "") == sample_machine_name.replace(/\s/g, "")){
                this.benchmark = sample.name;
              }
            });
            file.updatePoaWithNewSampleName(sample_machine_name, sample.name);
            $(knuvu_file).find('div#sample_'+sample_machine_name).html(sample.name).attr('id', 'sample_'+sample.name.replace(/\s/g, "")).parent().attr('href', 'javascript:file.selectObject(\'sample\', \'sample_'+sample.name.replace(/\s/g, "")+'\');');
            $(form).find('input#sample_name').val(sample.name.replace(/\s/g, ""));
          } else {
            knuvu.log('Invalid sample name');
          }
          file.resizeFile();
          break;
        }

        case 'group':{ var form = $(file_menu).find('form#group');
          if(file.validateName($(form).find('input#name').val(), file.group)){
            var group_machine_name = $(form).find('input#group_name').val();
            var group = file.getGroup(group_machine_name);
            group.name = $(form).find('input#name').val();
            for(var i = 0; i < file.poa.length; i++){
              if(file.poa[i].group.replace(/\s/g, "") == group_machine_name){
                file.poa[i].group = group.name;
              }
            }
            $(knuvu_file).find('div#group_'+group_machine_name).attr('id', 'group_'+group.name.replace(/\s/g, "")).find('a').first().attr('id', 'add-poa-'+group.name.replace(/\s/g, "")).parent().find('a#group_ancor').attr('href', 'javascript:file.selectObject(\'group\', \'group_'+group.name.replace(/\s/g, "")+'\');').find('div.group-header').html(group.name);
            $(form).find('input#group_name').val(group.name.replace(/\s/g, ""));
          } else {
            knuvu.log('Invalid group name');
          }
          file.resizeFile();
          break;
        }

        case 'poa':{ var form = $(file_menu).find('form#poa');
          var rank_change = ($(form).find('input#priority_original').val() != $(form).find('select#priority').val() || $(form).find('input#rank_by_original').val() != $(form).find('select#rank_by').val() || $(form).find('input#scale_original').val() != $(form).find('select#scale').val() || $(form).find('input#benchmark_original').val().replace(/\s/g, "") != $(form).find('select#benchmark').val().replace(/\s/g, ""));
          var name_group_change = file.validateNameAndGroup($(form).find('input#name').val(), $(form).find('select#poa_group').val().replace(/\s/g, ""), file.poa, $(form).find('input#poa_name').val());
          if( name_group_change || rank_change){
            var poa_machine_name = $(form).find('input#poa_name').val();
            var poa_group_machine_name = $(form).find('input#poa_group_name').val();
            var priority_original = $(form).find('input#priority_original').val();
            var rank_by_original = parseInt( $(form).find('input#rank_by_original').val() );
            var scale_original = parseInt( $(form).find('input#scale_original').val() );
            var benchmark_original = $(form).find('input#benchmark_original').val();
            var nested_type = parseInt( $(form).find('input#poa_nested_type').val() );//Nested Group
            var nested_file_id = parseInt( $(form).find('input#poa_nested_file_id').val() );
            var nested_group_id = parseInt( $(form).find('input#poa_nested_group_id').val() );
            var poa = file.getPOA(poa_machine_name);
            var poa_group = $(form).find('select#poa_group').val();
            var poa_name = $(form).find('input#name').val();

            var poa_hash = file.poaNameCheck(poa.name, poa_name, poa_group);

            if(poa_hash.error == 0){
              poa.nt = nested_type;
              poa.nf = nested_file_id;
              poa.ng = nested_group_id;
              var poa_section = $(knuvu_file).find('div#poa_'+poa.name.replace(/\s/g, ""));
              if(poa.nt != 0){
                $(poa_section).addClass('has-nested');
                file.addNestedFilesIfExist(poa);
              } else {
                $(poa_section).removeClass('has-nested');
                poa.name = poa_hash.name;
                $(form).find('input#name').val(poa.name);
                poa.group = poa_group;
                poa.performance_priority = parseInt( $(form).find('select#priority').val() );
                poa.rank_by = parseInt( $(form).find('select#rank_by').val() );
                poa.scale = parseInt( $(form).find('select#scale').val() );
                poa.benchmark = $(form).find('select#benchmark').val();

                $(knuvu_file).find('div#poa_'+poa_machine_name).attr('id', 'poa_'+poa.name.replace(/\s/g, "")).find('a#poa_ancor').attr('href', 'javascript:file.selectObject(\'poa\', \'poa_'+poa.name.replace(/\s/g, "")+'\');').find('div.poa-header').html(poa.name);
                if(poa.group.replace(/\s/g, "") != poa_group_machine_name){
                  $(knuvu_file).find('div#poa_'+poa.name.replace(/\s/g, "")).detach().appendTo('div#group_'+poa.group.replace(/\s/g, ""));
                }
                file.updateRankScaleBenchmark(poa);
                var poa_section = $(knuvu_file).find('div#poa_'+poa.name.replace(/\s/g, ""));
                for(var i = 0; i < file.discrete_poa.length; i++){
                  var this_poa = file.discrete_poa[i].poa.replace(/\s/g, "");
                  if(this_poa == poa_machine_name){
                    $(poa_section).find('a#ancor_'+poa_machine_name+'_'+file.discrete_poa[i].competitor.replace(/\s/g, "")).attr('href', 'javascript:file.selectObject(\'dpoa\', \'dpoa_'+poa.name.replace(/\s/g, "")+'_'+file.discrete_poa[i].competitor.replace(/\s/g, "")+'\');').attr('id', 'ancor_'+poa.name.replace(/\s/g, "")+'_'+file.discrete_poa[i].competitor.replace(/\s/g, "")).find('div').first().attr('id', 'dpoa_'+poa.name.replace(/\s/g, "")+'_'+file.discrete_poa[i].competitor.replace(/\s/g, ""));
                    file.discrete_poa[i].poa = poa.name;
                  }
                }

                $(form).find('input#poa_name').val(poa.name.replace(/\s/g, ""));
                $(form).find('input#poa_group_name').val(poa.group.replace(/\s/g, ""));
                file.refreshPOA(poa, priority[poa.performance_priority]);
              }
            } else
            if(poa_hash.error == 1){
              knuvu.throwError('Duplicate Name', 'POA\'s within the same group cannot have the same name.');
              knuvu.log('Duplicate poa name');
            }
          } else {
            knuvu.log('Invalid poa name');
          }
          file.resizeFile();
          break;
        }

        case 'dpoa':{ var form = $(file_menu).find('form#dpoa');
          var label_original = $(form).find('input#label_original').val();
          var performance_original = $(form).find('input#performance_original').val();
          var risk_original = $(form).find('input#risk_original').val();
          var poa_original = $(form).find('input#poa').val();
          var sample_original = $(form).find('input#sample').val();
          var dpoa = file.getDPOA($(form).find('input#poa').val()+'_'+$(form).find('input#sample').val());
          var poa = file.getPOA(poa_original);

          dpoa.performance_label = $(form).find('input#label').val();
          var old_id = poa_original.replace(/\s/g, "")+'_'+sample_original.replace(/\s/g, "");
          var element_dpoa = $(knuvu_file).find('div.poa-section').find('div#dpoa_'+old_id);
          if(poa.nt != 0){
            $(element_dpoa).find('p').html(dpoa.performance_label);
          } else {
            dpoa.performance = parseInt( $(form).find('select#performance').val() );
            dpoa.performance_risk = parseInt( $(form).find('select#risk').val() );
            $(element_dpoa).removeClass('no-performance low-performance medium-performance high-performance').addClass(file.getPerformance(dpoa.performance, poa.rank_by, poa.scale, poa.benchmark, poa.name));
            $(element_dpoa).html('<div class="risk '+file.getRisk(dpoa.performance_risk)+'"></div><p>'+dpoa.performance_label+'</p>');
            file.updateRankScaleBenchmark(poa);
          }
          file.updateScore();
          file.resizeFile();
          break;
        }
      }
    },
    deleteObject: function(type){
      var file_menu = $('div.file-menu');
      var knuvu_file = $('div.knuvu-file');
      switch(type){

        case 'sample':{ var form = $(file_menu).find('form#sample'); var general = $(file_menu).find('form#general');
          var sample_machine_name = $(form).find('input#sample_name').val();
          if( file.validateNotEmpty(sample_machine_name) && !file.isBaseSample(sample_machine_name) ){
            file.popSample(sample_machine_name)
            $(knuvu_file).find('div#sample_'+sample_machine_name).parent().remove();
            $.each(file.poa, function(){
              $(knuvu_file).find('a#ancor_'+this.name.replace(/\s/g, "")+'_'+sample_machine_name).remove();
            });
            file.resizeFile();
          }
          break;
        }

        case 'group':{ var form = $(file_menu).find('form#group');
          var group_machine_name = $(form).find('input#group_name').val();
          if( file.validateNotEmpty(group_machine_name) ){
            file.popGroup(group_machine_name);
            $(knuvu_file).find('div#group_'+group_machine_name.replace(/\s/g, "")).remove();
            file.resizeFile();
          }
          break;
        }

        case 'poa':{ var form = $(file_menu).find('form#poa');
          var poa_machine_name = $(form).find('input#poa_name').val();
          if( file.validateNotEmpty(poa_machine_name) ){
            file.popPOA(poa_machine_name);
            $(knuvu_file).find('div#poa_'+poa_machine_name.replace(/\s/g, "")).remove();
            file.resizeFile();
          }
          break;
        }

      }
    },
    updateScore: function(){
      poa_to_group = {};
      $.each(file.poa, function(){
        poa_to_group[this.name] = this;
      });
      var gs = [];
      var fs = [];
      $.each(file.group, function(){ var group = this;
        gs[this.id] = []; //group score
        var ensure_no_double_set = 0;
        $.each(file.competitor, function(){ var candidate = this;
          fs[this.id] = {}; fs[this.id].p = 0; fs[this.id].r = 0; //file score
          gs[group.id][this.id] = {}; gs[group.id][this.id].p = 0; gs[group.id][this.id].r = 0;
          var dpoa_in_group = 0;
          var dpoa_in_candidate = 0;
          $.each(file.discrete_poa, function(){ var dpoa = this;
            var meta = null;
            if(dpoa.competitor.replace(/\s/g, "") == candidate.name.replace(/\s/g, "")){
              if(ensure_no_double_set == 0){
                meta = (poa_to_group[dpoa.poa].nt != 0) ? file.getMetaScoreDPOA(poa_to_group[dpoa.poa], dpoa) : null;
                dpoa_in_candidate++;
                if(meta == null){
                  fs[candidate.id].p += dpoa.performance;
                  fs[candidate.id].r += dpoa.performance_risk;
                } else {
                  fs[candidate.id].p += meta.performance;
                  fs[candidate.id].r += meta.risk;
                }
              }
              if(poa_to_group[dpoa.poa].group.replace(/\s/g, "") == group.name.replace(/\s/g, "")){
                meta = (poa_to_group[dpoa.poa].nt != 0) ? file.getMetaScoreDPOA(poa_to_group[dpoa.poa], dpoa) : null;
                dpoa_in_group++;
                if(meta == null){
                  gs[group.id][candidate.id].p += dpoa.performance;
                  gs[group.id][candidate.id].r += dpoa.performance_risk;
                } else {
                  gs[group.id][candidate.id].p += meta.performance;
                  gs[group.id][candidate.id].r += meta.risk;
                }
              }
            }
          });
          if(ensure_no_double_set == 0){
            fs[candidate.id].p = Math.round(fs[candidate.id].p / dpoa_in_candidate);
            fs[candidate.id].r = Math.round(fs[candidate.id].r / dpoa_in_candidate);
          }
          gs[group.id][candidate.id].p = Math.round(gs[group.id][candidate.id].p / dpoa_in_group);
          gs[group.id][candidate.id].r = Math.round(gs[group.id][candidate.id].r / dpoa_in_group);
        });
        ensure_no_double_set++;
      });
      file.meta.fs = fs;
      file.meta.gs = gs;
    },
    poaNameCheck: function(select_name, name, group){
      var temp_hash = { 'error': 0,
                        'name': name,
                        'group': group
                     };
      var a = 0;
      for(var i = 0; i < file.poa.length; i++){
        if(temp_hash.name.replace(/\s/g, "").toUpperCase() == file.poa[i].name.replace(/\s/g, "").toUpperCase())
        {
          if(temp_hash.name.replace(/\s/g, "") != select_name.replace(/\s/g, ""))
          {
            temp_hash.name = temp_hash.name + ' - ' + temp_hash.group;
          }
          else
          {
            break;
          }
          for(var j = 0; j < file.poa.length; j++){
            if(temp_hash.name.replace(/\s/g, "") == file.poa[j].name.replace(/\s/g, ""))
            {
              temp_hash.error = 1;
              break;
            }
          }
          break;
        }
      }
      return temp_hash;
    },
    getSample: function(name){
      for(var i = 0; i < file.competitor.length; i++){
        if(name.replace(/\s/g, "") == file.competitor[i].name.replace(/\s/g, "")){
          return file.competitor[i];
        }
      }
    },
    popSample: function(name){
      for(var i = 0; i < file.competitor.length; i++){
        if(name.replace(/\s/g, "") == file.competitor[i].name.replace(/\s/g, "")){
          file.competitor.splice(i, 1);
          break;
        }
      }
      for(var i = 0; i < file.discrete_poa.length; i++){
        if(file.discrete_poa[i].competitor.replace(/\s/g, "") == name.replace(/\s/g, "")){
          file.discrete_poa.splice(i, 1);
          i--;
        }
      }
      file.clearFileFormStates();
    },
    getGroup: function(name){
      for(var i = 0; i < file.group.length; i++){
        if(name.replace(/\s/g, "") == file.group[i].name.replace(/\s/g, "")){
          return file.group[i];
        }
      }
    },
    popGroup: function(name){
      for(var i = 0; i < file.group.length; i++){
        if(name.replace(/\s/g, "") == file.group[i].name.replace(/\s/g, "")){
          file.group.splice(i, 1);
          break;
        }
      }
      for(var i = 0; i < file.poa.length; i++){
        if(name.replace(/\s/g, "") == file.poa[i].group.replace(/\s/g, "")){
          var poa_name = file.poa[i].name;
          file.poa.splice(i, 1);
          i--;
          for(var j = 0; j < file.discrete_poa.length; j++){
            if(file.discrete_poa[j].poa.replace(/\s/g, "") == poa_name.replace(/\s/g, "")){
              file.discrete_poa.splice(j, 1);
              j--;
            }
          }
        }
      }
      file.clearFileFormStates();
    },
    getPOA: function(name){
      for(var i = 0; i < file.poa.length; i++){
        if(name.replace(/\s/g, "") == file.poa[i].name.replace(/\s/g, "")){
          return file.poa[i];
        }
      }
    },
    popPOA: function(name){
      for(var i = 0; i < file.poa.length; i++){
        if(name.replace(/\s/g, "") == file.poa[i].name.replace(/\s/g, "")){
          file.poa.splice(i, 1);
          break;
        }
      }
      for(var i = 0; i < file.discrete_poa.length; i++){
        if(file.discrete_poa[i].poa.replace(/\s/g, "") == name.replace(/\s/g, "")){
          file.discrete_poa.splice(i, 1);
          i--;
        }
      }
      file.clearFileFormStates();
    },
    getDPOA: function(poa_sample){
      var poa = poa_sample.split("_")[0].replace(/\s/g, "");
      var sample = poa_sample.split("_")[1].replace(/\s/g, "");
      for(var i = 0; i < file.discrete_poa.length; i++){
        if(poa == file.discrete_poa[i].poa.replace(/\s/g, "") && sample == file.discrete_poa[i].competitor.replace(/\s/g, "")){
          return file.discrete_poa[i];
        }
      }
    },
    getMetaScoreDPOA: function(poa, dpoa){
      if(poa.nt == 0){
        return null;
      } else {
        var score = {};

        if(poa.nt == 1){//return files meta score
          $.each(file.nested, function(){
            if(this.id == poa.nf){
              var meta = this.meta;
              $.each(this.competitor, function(){
                if(this.name.replace(/\s/g, "") == dpoa.competitor.replace(/\s/g, "")){
                  score.performance = meta.fs[this.id].p;
                  score.risk = meta.fs[this.id].r;
                }
              });
            }
          });
        } else
        if(poa.nt == 2){//return file.groups meta score
          $.each(file.nested, function(){
            if(this.id == poa.nf){
              var meta = this.meta;
              $.each(this.competitor, function(){
                if(this.name.replace(/\s/g, "") == dpoa.competitor.replace(/\s/g, "")){
                  score.performance = meta.gs[poa.ng][this.id].p;
                  score.risk = meta.gs[poa.ng][this.id].r;
                }
              });
            }
          });
        }

        return score;
      }
    },
    updatePoaWithNewSampleName: function(old_name, new_name){
      var knuvu_file = $('div.knuvu-file');
      $.each(file.discrete_poa, function(){
        if(this.competitor.replace(/\s/g, "") == old_name.replace(/\s/g, "")){
          this.competitor = new_name;
          $(knuvu_file).find('a#ancor_'+this.poa.replace(/\s/g, "")+'_'+old_name.replace(/\s/g, "")).attr('href', 'javascript:file.selectObject(\'dpoa\', \'dpoa_'+this.poa.replace(/\s/g, "")+'_'+this.competitor.replace(/\s/g, "")+'\');').attr('id', 'ancor_'+this.poa.replace(/\s/g, "")+'_'+this.competitor.replace(/\s/g, "")).find('div#dpoa_'+this.poa.replace(/\s/g, "")+'_'+old_name.replace(/\s/g, "")).attr('id', 'dpoa_'+this.poa.replace(/\s/g, "")+'_'+this.competitor.replace(/\s/g, ""));
        }
      });
    },
    validateName: function(name, list){
      if(name.match(/[^A-Za-z0-9\s-]/i) != null){
        knuvu.throwError("Invalid Name", "The name you entered contains invalid characters or is blank. Please enter a valid name. Valid Characters: A-Z 0-9 - (dash).");
        return false;
      }
      for(var i = 0; i < list.length; i++){
        if(name.replace(/\s/g, "") == list[i].name.replace(/\s/g, "")){
          knuvu.throwError('Duplicate Name', 'Name is already in use, please choose another.');
          return false;
        }
        if(name == '' || name.match(/^[\s]+$/i) != null){
          knuvu.throwError('Empty Name', 'Name cannot be empty.');
          return false;
        }
      }
      return true;
    },
    validateNameAndGroup: function(name, group, list, original_name){
      if(name.match(/[^A-Za-z0-9\s-]/i) != null){
        knuvu.throwError("Invalid Name", "The name you entered contains invalid characters or is blank. Please enter a valid name. Valid Characters: A-Z 0-9 - (dash).");
        return false;
      }
      if(name.replace(/\s/g, "") == original_name.replace(/\s/g, "")){
        return true;
      }
      for(var i = 0; i < list.length; i++){
        if(name.replace(/\s/g, "") == list[i].name.replace(/\s/g, "") && group.replace(/\s/g, "") == list[i].group.replace(/\s/g, "")){
          knuvu.throwError('Duplicate Name', 'POA\'s within the same group cannot have the same name.');
          return false;
        }
        if(name == '' || name.match(/^[\s]+$/i) != null){
          knuvu.throwError('Empty Name', 'Name cannot be empty.');
          return false;
        }
      }
      return true;
    },
    validateNotEmpty: function(test){
      if( test == '' || test.match(/^[\s]+$/i) != null){
        return false;
      }
      return true;
    },
    isBaseSample: function(sample){
      return ( sample.replace(/\s/g, "").toUpperCase() == file.competitor[0].name.replace(/\s/g, "").toUpperCase() );
    },
    refreshPOA: function(poa, poa_priority_from_sample){
      var knuvu_file = $('div.knuvu-file');
      var dpoas = $(knuvu_file).find('div#poa_'+poa.name.replace(/\s/g, "")).find('div.discrete-poa');
      $.each(dpoas, function(i){
        $(this).removeClass('no-priority low-priority medium-priority high-priority').addClass(poa_priority_from_sample);
      });
    },
    updateRankScaleBenchmark: function(poa){
      var knuvu_file = $('div.knuvu-file');
      $.each(file.discrete_poa, function(){
        if(this.poa.replace(/\s/g, "") == poa.name.replace(/\s/g, "")){
          meta = (poa.nt != 0) ? file.getMetaScoreDPOA(poa, this) : null;
          if(meta != null && meta.performance != undefined){
            var element_dpoa = $(knuvu_file).find('div.poa-section').find('div#dpoa_'+poa.name.replace(/\s/g, "")+'_'+this.competitor.replace(/\s/g, ""));
            $(element_dpoa).removeClass('no-performance low-performance medium-performance high-performance').addClass(file.getPerformance(meta.performance, poa.rank_by, poa.scale, poa.benchmark, poa.name));
          } else {
            var element_dpoa = $(knuvu_file).find('div.poa-section').find('div#dpoa_'+poa.name.replace(/\s/g, "")+'_'+this.competitor.replace(/\s/g, ""));
            $(element_dpoa).removeClass('no-performance low-performance medium-performance high-performance').addClass(file.getPerformance(this.performance, poa.rank_by, poa.scale, poa.benchmark, poa.name));
          }
        }
      });
    },
    clearNestedMenu: function(){
      var file_menu = $('div.file-menu');
      //file.clearFileFormStates();
      $('div.file-menu').find('form:not(#general)').find('input:not(.form-submit-input)').val('');
      if($(file_menu).find('input#toggle-nested').attr("checked") == 'checked'){
        $(file_menu).find('input#toggle-nested').attr("checked", false).trigger('change');
      }
    },
    clearFileFormStates: function(){
      var file_menu = $('div.file-menu');
      var knuvu_file = $('div.knuvu-file');
      $(knuvu_file).find('*').removeClass('focused');
      $(file_menu).find('form:not(#general)').find('input:not(.form-submit-input)').val('');
      $(file_menu).find('form').find('select').val('');
    },
    toggleRisk: function(){
      var toggle = $('div#risk-toggle');
      if(toggle.length > 0){
        $(toggle).remove();
      } else {
        $('body').prepend('<div id="risk-toggle"><style type="text/css">div.knuvu-file div.poa-container div.group div.poa div.discrete-poa div.risk{display:none;}</style></div>');
      }
    },
    toggleLabel: function(){
      var toggle = $('div#label-toggle');
      if(toggle.length > 0){
        $(toggle).remove();
      } else {
        $('body').prepend('<div id="label-toggle"><style type="text/css">div.knuvu-file div.poa-container div.group div.poa div.discrete-poa p{display:none;}</style></div>');
      }
    },
    toggleNested: function(){
      console.log('toggling nested');
      var toggle = $('div#nested-toggle');
      var file_menu = $('div.file-menu').find('div.poa-menu');
      if(toggle.length > 0){
        $(toggle).remove();
        $(file_menu).find('label#nested-model-label').find('span').html('none');
        $(file_menu).find('input#poa_nested_type').val(0);
        $(file_menu).find('input#poa_nested_file_id').val(0);
        $(file_menu).find('input#poa_nested_group_id').val(0);
      } else {
        $('body').prepend('<div id="nested-toggle"><style type="text/css">div.file-menu .non-nested-control{display:none;} div.file-menu .nested-control{display:inline-block;}</style></div>');
      }
    },
    handleNestedType: function(select){
      if(select.val() == 0){//None
        $('.nested-control-group').hide();
      } else
      if(select.val() == 1){//KnuVu File
        $('.nested-control-group').hide();
      } else
      if(select.val() == 2){//Group
        $('.nested-control-group').show();
      }
    },
    handleNestedFile: function(select){
      console.log('Handleing Nested File: '+select.val());
      //knuvu.loadFile(poa.nf, function(){});
    },
    handleNestedGroup: function(select){
      console.log('Handleing Nested Group: '+select.val());
    },
    selectedObjectTypeIs: function(type){
      var knuvu_file = $('div.knuvu-file');
      var selected_object = $(knuvu_file).find('div.focused');
      if( /dpoa/i.test(type) ){
        return /dpoa_/i.test($(selected_object).attr('id'));
      } else
      if( /poa/i.test(type) ){
        return /poa_/i.test($(selected_object).attr('id'));
      } else
      if( /group/i.test(type) ){
        return /group_/i.test($(selected_object).attr('id'));
      } else
      if( /sample/i.test(type) ){
        return /sample_/i.test($(selected_object).attr('id'));
      }
      return false;
    },
    selectDPOABelowFocusedDPOA: function(){
      if( file.selectedObjectTypeIs('dpoa') ){
        var dpoa_section = $('div.poa-section');
        var current = $(dpoa_section).find('div.focused');
        if( $(current).length > 0){
          var id = $(current).attr('id').replace(/dpoa_/g, "");
          var sample = id.replace(/^.+_/i, "");
          var current_poa = id.replace(/_.+/i, "");
          var poa_down = $(current).parent().next().children();
          if($(poa_down).length > 0){
            file.selectObject('dpoa', $(poa_down).attr('id'));
            file.scrollToElement($(poa_down).attr('id'));
          }
        }
      }
    },
    selectDPOAAboveFocusedDPOA: function(){
      if( file.selectedObjectTypeIs('dpoa') ){
        var dpoa_section = $('div.poa-section');
        var current = $(dpoa_section).find('div.focused');
        if( $(current).length > 0){
          var id = $(current).attr('id').replace(/dpoa_/g, "");
          var sample = id.replace(/^.+_/i, "");
          var current_poa = id.replace(/_.+/i, "");
          var poa_up = $(current).parent().prev().children();
          if($(poa_up).attr('id') != undefined){
            file.selectObject('dpoa', $(poa_up).attr('id'));
            file.scrollToElement($(poa_up).attr('id'));
          }
        }
      }
    },
    selectDPOARightOfFocusedDPOA: function(){
      if( file.selectedObjectTypeIs('dpoa') ){
        var dpoa_section = $('div.poa-section');
        var current = $(dpoa_section).find('div.focused');
        if( $(current).length > 0){
          var id = $(current).attr('id').replace(/dpoa_/g, "");
          var sample = id.replace(/^.+_/i, "");
          var current_poa = id.replace(/_.+/i, "");
          var poa_to_right = $(current).parent().parent().next();
          if( $(poa_to_right).length > 0){
            var next_poa = $(poa_to_right).attr('id').replace(/poa_/g, "");
            file.selectObject('dpoa', "dpoa_"+next_poa+"_"+sample);
            file.scrollToElement("dpoa_"+next_poa+"_"+sample);
          } else {
            var group_to_right = $(current).parent().parent().parent().next();
            if( $(group_to_right).length > 0 ){
              var next_poa = $( $(group_to_right).children()[2] );//.attr('id').replace(/poa_/g, "");
              if($(next_poa).context != undefined){
                file.selectObject('dpoa', "dpoa_"+$(next_poa).attr('id').replace(/poa_/g, "")+"_"+sample);
                file.scrollToElement("dpoa_"+$(next_poa).attr('id').replace(/poa_/g, "")+"_"+sample);
              }
            }
          }
        }
      }
    },
    selectDPOALeftOfFocusedDPOA: function(){
      if( file.selectedObjectTypeIs('dpoa') ){
        var dpoa_section = $('div.poa-section');
        var current = $(dpoa_section).find('div.focused');
        if( $(current).length > 0){
          var id = $(current).attr('id').replace(/dpoa_/g, "");
          var sample = id.replace(/^.+_/i, "");
          var current_poa = id.replace(/_.+/i, "");
          var poa_to_left = $(current).parent().parent().prev();
          if( $(poa_to_left).prop("tagName") != 'A'){
            var next_poa = $(poa_to_left).attr('id').replace(/poa_/g, "");
            file.selectObject('dpoa', "dpoa_"+next_poa+"_"+sample);
            file.scrollToElement("dpoa_"+next_poa+"_"+sample);
          } else {
            var group_to_left = $(current).parent().parent().parent().prev();
            if( $(group_to_left).length > 0 ){
              var next_poa = $(group_to_left).children().last().attr('id').replace(/poa_/g, "");
              file.selectObject('dpoa', "dpoa_"+next_poa+"_"+sample);
              file.scrollToElement("dpoa_"+next_poa+"_"+sample);
            }
          }
        }
      }
    },
    scrollToElement: function(element){
      element = $('#'+element);
      var half_width = ($(element).width() / 2) + 4;
      var half_height = ($(element).height() / 2) + 4;
      var x = $(element).offset().left + half_width;
      var y = $(element).offset().top + half_height;
      var topY = $(document).scrollTop();
      var bottomY = topY + window.innerHeight;
      if(y + half_height > bottomY){
        $('html, body').animate({ scrollTop: ( window.pageYOffset + $(element).height() * 3 ) }, 150);
      } else
      if(y - half_height < topY){
        $('html, body').animate({ scrollTop: ( window.pageYOffset - $(element).height() * 3 ) }, 150);
      }
    }
  };
  global.file = file;
})(jQuery, window, document, navigator, this);

$(document).ready(function() {
  file.resizeFile();
});

$(window).resize(function() {
  file.resizeFile();
});