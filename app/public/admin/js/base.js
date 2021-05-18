$(function(){
	
	app.init();
	
})

	let app = {


		init(){
				$('.aside h4').click(function(){
					//$(this).toggleClass('active');
					$(this).siblings('ul').slideToggle();
				})
		},

		/**
		 *  修改状态
		 * @param {*} el  带修改的元素
		 * @param {*} model 数据库
		 * @param {*} attr  要修改的属性名
		 * @param {*} _id   id
		 */
		changeStatus(el, model, attr, _id){
			$.get("/admin/changeStatus", {
				model, attr, _id
			}, data=>{
				if(data.success){
					if(el.src.indexOf("yes")> -1){
						el.src= "/public/admin/images/no.gif";
					}else{
						el.src= "/public/admin/images/yes.gif";
					}
				}
			});

		}
	
		
	}

