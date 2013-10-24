/**
为弹窗Modal提供可拖拽功能
	函数：draggable 接收一个modal的id选择器,
	如有个弹窗是 <div id="aa" class="modal..">
	那么只需在改弹窗加载完毕后执行(一般在所属的Template.template.rendered是事件中进行调用)
	ModalDrag.draggable("#aa");既可实现拖拽
**/
ModalDrag={}
Object.defineProperty(ModalDrag,"draggable",{
	value:function(selector){
		$(selector).draggable({
    		handle: ".modal-header"
		});
		$(selector+" .modal-header").mousedown(function(){
			$(this).css("cursor","move");
		}).mouseup(function(){
			$(this).css("cursor","default");
		});
	}
})