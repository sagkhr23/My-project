$(function(){
  
  
	var $list = $('.todo-list');
  var $clonelist = $('#clone-list');
  var $input = $('.todo-input');
  var completeNum=0;
  
  //Methods for Adding
  function addTodo(text){
  	//create item
    var $li = $('<li class="li-item ui-state-default">');
    var $dragable = $('<span class="dragable"></span>');
    var $checkbox = $('<span class="checkbox"></span>');
    var $text = $('<span class="text">').text(text);
    var $remove = $('<span class="remove"></span>');
    $li.append($dragable).append($checkbox).append($text).append($remove);
    //$li.append($text);
    
    //add it to the list
    $list.append($li);

    //ready for DnD
    $li.ready(initListItem($li,$checkbox,$remove));
  }
  

  //Methods for send
  $('.todo-form').bind('submit', function(e){
  	//stop the default behavior
    e.preventDefault();
    
    //get the text
    var text = $input.val();
    if(text){
    
    //add
    addTodo(text);
    
    //delete the value
    $input.val('');
    }else{
       $('.container').animate({ left: "-5px" }, 100).animate({ left: "20px" }, 100)
                            .animate({ left: "-10px" }, 100).animate({ left: "10px" }, 100)
                            .animate({ left: "0px" }, 100);
    }
  });
  
  //Sortable DnD
  $('.todo-list').sortable({
    axis:'y',
    handle: ".dragable",
    revert: 100,
    scroll: false,
    placeholder:"sortable-placeholder",
    cursor:'move',
    start:function(event,ui){
      ui.helper.addClass("exclude-me");
      $(".todo-list .li-item:not(.exclude-me)").css("visibility", "hidden");
      ui.helper.data("clone").hide();
      $(".clone-list .li-item").css("visibility", "visible");
    },
    stop:function(event,ui){
       $(".todo-list .li-item.exclude-me").each(function() {
        var item = $(this);
        var clone = item.data("clone");
        var position = item.position();

        clone.css("left", position.left);
        clone.css("top", position.top);
        clone.show();

        item.removeClass("exclude-me");
      });

      
      $(".todo-list .li-item").css("visibility", "visible");
      $(".clone-list .li-item").css("visibility", "hidden");
    },
  change: function(e, ui) {
    $(".todo-list .li-item:not(.exclude-me)").each(function() {
      var item = $(this);
      var clone = item.data("clone");
      clone.stop(true, false);
      var position = item.position();
      clone.css({
        left: position.left,
        top: position.top
      });
    });
    }
  });
  
  //Button Interactions
  $('.my-func').hover(function(){
    $(this).addClass('hover');
  },function(){
    $(this).removeClass('hover');
  });
  
  $('h1').click(function(){
    var num = $('.todo-list .li-item').length;
    var numComp = $('.todo-list .complete').length;
    //alert(numComp);
    if(num==numComp){
      if(num){
        
        $('.li-item').each(function(){
          $(this).removeClass('complete');
        });
        $('footer').removeClass('active').prop("disabled", true);
        completeNum = 0;
      }
    }else{
      if(num){
        $('.li-item').each(function(){

              $(this).addClass('complete');
              completeNum++;
        });
        $('footer').addClass('active').prop("disabled", false);
      }
    }
     
     
  });
  $('h1').on('mousedown',function(){
    $(this).addClass('click');
  });
  $('h1').on('mouseup',function(){
    $(this).removeClass('click');
  });
  
	$('#delete').click(function(){
  	$('.complete').each(function(){
    	$(this).remove();
      
    });
    
    completeNum=0;
    $('footer').removeClass('active').prop("disabled", true);
    $('.my-list').height(272);
    
    $(".todo-list .li-item").each(function() {
        var item = $(this);
        var clone = item.data("clone");
        var position = item.position();

        clone.css("left", position.left);
        clone.css("top", position.top);
     });
    setTimeout(function(){
    $('#my-list').perfectScrollbar('update');},300);
  });
  $('.todo-input').focus(function(){
    $('.icn-input').fadeOut('fast');
    $('.todo-add').removeClass('not-focused');//.prop("disabled", false);
  }).blur(function(){
    $('.icn-input').fadeIn('fast');
    var tmpText = $('.todo-input').val();
    if(!tmpText && !$('.todo-add').hasClass('not-focused')){
    $('.todo-add').addClass('not-focused');//.prop("disabled", true);
    }
  });
  
  $('.todo-add').hover(function(){
    $(this).addClass('hover');
  },function(){
     $(this).removeClass('hover');                  
  });
  
  $('.todo-add').click(function(){
    $(this).addClass('click');
    if(!$('.todo-input').focus()){
    $(this).addClass('not-focused');//.prop("disabled", true);
    }
    setTimeout(function(){
      $('.todo-add').addClass('clickdone');
       
    },400);
    setTimeout(function(){
      $('.todo-add').removeClass('click');
      $('.todo-add').removeClass('clickdone');
      
    },800);
  });
  
  //Functioncs
  function initListItem(li, checkbox, remove){
      var item = li;
      var itemClone= item.clone();
      item.data('clone',itemClone);
      var position = item.position();
      //alert(position.top);
      itemClone.css({
        left:position.left,
        top:position.top,
        visibility:'hidden'
      }).addClass('clone');
      $('#clone-list').append(itemClone);
      //Complete
      checkbox.click(function(){
        if(li.hasClass('complete')){
          li.removeClass('complete');
          itemClone.removeClass('complete');
          completeNum--;
          if(!completeNum){
            $('footer').removeClass('active').prop("disabled", true);
            $('.my-list').height(272);
          }
        }else{
          li.addClass('complete');
          itemClone.addClass('complete');
          completeNum++;
          if(completeNum){
            $('footer').addClass('active').prop("disabled", false);
            $('.my-list').height(224);
          }
        }
      });
    
      //remove
      remove.click(function(){
        if(li.hasClass('complete')){
          completeNum--;
          if(!completeNum){
            $('footer').removeClass('active').prop("disabled", true);
            $('.my-list').height(272);
          }
        }
        li.remove();
        itemClone.remove();
        
        
        
        $(".todo-list .li-item").each(function() {
        var item = $(this);
        var clone = item.data("clone");
        var position = item.position();

        clone.css("left", position.left);
        clone.css("top", position.top);
        });
        $('#my-list').perfectScrollbar('update');
      });
      
      $('#my-list').perfectScrollbar('update');
      $(".todo-list").sortable('refresh');
  }
  
  //init
  $('#my-list').perfectScrollbar();  
  $('.li-item').each(function(){
      var checkbox = $(this).children('.checkbox');
      var remove =$(this).children('.remove');
      initListItem($(this), checkbox, remove);
    });
});
