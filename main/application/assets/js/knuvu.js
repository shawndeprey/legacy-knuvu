var logging = true;
var error_timeout_key = null;
var php_error = true;
(function($, window, document, navigator, global){
	var knuvu = knuvu ? knuvu : {
		initKnuvu: function(){
			knuvu.log('Initializing Knuvu App...');
			knuvu.fixPlaceholder();
		},
		log: function(text) {
			if(logging){ console.log(text); }
		},
		fixPlaceholder: function(){
			var form = $('form')
			var input = $(form).find('input');
			var textarea = $(form).find('textarea');
			var addPlaceholder = false;
			$.each(input, function(){ addPlaceholder = true; });
			$.each(textarea, function(){ addPlaceholder = true;});
			if(addPlaceholder){ $('input[placeholder], textarea[placeholder]').placeholder(); }
		},
		addValidationFormsOnPage: function(){
			var form = $('form.validated-form');
			var input = $(form).find('input');
			$.each(input, function(){
				if($(this).attr('type') == 'submit'){
					$(this).addClass('check-valid');
					$(this).off('click').on('click', function(){
						knuvu.validateForm(form);
						return false;
					});
				} else {
					$(this).addClass('validate');
				}
			});
		},
		validateForm: function(form){
			var input = $(form).find('input.validate');
			var valid = true;
			$.each(input, function(){
				if( $(this).val() == '' || $(this).val().match(/^[\s]+$/i) != null || $(this).val() == undefined ){
					$(this).val(null).attr('placeholder', 'Invalid input...');
					form.addClass('error');
					valid = false;
				}
			});
			if(valid){ form.submit(); }
		},
		addslashes: function(string) {
		    return string.replace(/\\/g, '\\\\').
		        replace(/\u0008/g, '\\b').
		        replace(/\t/g, '\\t').
		        replace(/\n/g, '\\n').
		        replace(/\f/g, '\\f').
		        replace(/\r/g, '\\r').
		        replace(/'/g, '\\\'').
		        replace(/"/g, '\\"');
		},
		popArray: function(Array, popThis){
			for(var i = popThis; i < Array.length - 1; i++) {
					Array[i] = Array[i + 1];
			}
			Array.pop();
		},
		throwPHPError: function(title, content){
			if(php_error){
				var error = $('div.error-form');
				$(error).find('span').html(title).parent().parent().find('p').html(content).parent().css('z-index', '1000').addClass('on');
				error_timeout_key = setTimeout('knuvu.removeError()', 10000);
				php_error = false;
			}
		},
		throwError: function(title, content){
			var error = $('div.error-form');
			$(error).find('span').html(title).parent().parent().find('p').html(content).parent().css('z-index', '1000').addClass('on');
			error_timeout_key = setTimeout('knuvu.removeError()', 10000);
		},
		removeError: function(){
			var error = $('div.error-form');
			$(error).removeClass('on');
			clearTimeout(error_timeout_key);
			setTimeout("knuvu.moveError()", 500);
		},
		moveError: function(){
			var error = $('div.error-form');
			$(error).css('z-index', '-1');
		},
		toTitleCase: function(str){
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		},
		startLoading: function(){
			$('div.loading-screen').removeClass('finished');
			setTimeout(function(){
				$('div.loading-screen').css('z-index', 2000);
			}, 0);
		},
		finishedLoading: function(){
			$('div.loading-screen').addClass('finished');
			setTimeout(function(){
				$('div.loading-screen').css('z-index', -2000);
			}, 1000);
		},
		loadUserModels: function(){
			$.getJSON(base_url+"feed/"+user_id+"/projects/all/attributes/"+api_key, {async: true}, function(yield){
				file.models = yield;
				file.populateUserModels();
			});
		},
		loadFile: function(id, callback){
			knuvu.startLoading();
			$.getJSON(base_url+"feed/project/"+id+"/"+api_key, {async: true}, function(yield){
				var data = {};
				data.id = yield.id;
				data.name = yield.name;
				data.owner = yield.owner;
				data.sample = yield.sample;
				data.meta = yield.file.meta;
				data.competitor = yield.file.competition;
				data.poa = yield.file.poa;
				data.group = yield.file.group;
				data.discrete_poa = yield.file.dpoa;
				file.addNestedFile(data);
				knuvu.finishedLoading();
				$.each(file.nested, function(){
					if(this.id == id){ callback(this); }
				});
			});
		},
		clone: function(obj) {
	    if (null == obj || "object" != typeof obj) return obj;
	    var copy = obj.constructor();
	    for (var attr in obj) {
	        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	    }
	    return copy;
		},
		toggleImportModel: function(){
			var knuvu_file = $('div.knuvu-file');
			var model = $('div.import-model');
			if($(knuvu_file).length > 0){
				file.saveAllModels();
				$(model).find('input.form-text-input').attr('disabled', 'disabled').val(file.name).css('opacity', 0.5);
				if($(model).find('input.id').length == 0){
					$(model).find('form').prepend('<input type="hidden" class="id" name="project-id" value="'+file.id+'" />');
				}
			}
			if($(model).hasClass('active-import')){
				$(model).removeClass('active-import');
			} else {
				$(model).addClass('active-import');
			}
		},
		changeDashboardTab: function(tab){
			var dashboard = $('div.dashboard');
			var current = $(dashboard).find("div.active");
			if($(current).attr('id') != tab){
				var items = $(dashboard).find('div.dashboard-menu-item');
				$(items).removeClass('active').addClass('hidden');
				$(dashboard).find('div#'+tab).removeClass('hidden').addClass('active');
				var tabs = $(dashboard).find('a.dashboard-tab');
				$(tabs).removeClass('selected');
				$(dashboard).find('a#tab-'+tab).addClass('selected');
			}
		}
	};
	global.knuvu = knuvu;
})(jQuery, window, document, navigator, this);

$(document).ready(function(){
	knuvu.input = new Input();
	knuvu.initKnuvu();
	knuvu.addValidationFormsOnPage();
});