let productsDom = '';
let deletepProductsDom='';


const app = Vue.createApp({
    data(){
        return{
            url:'https://vue3-course-api.hexschool.io/v2',
            path:'biggo',
            products:{
            },
            alertTitle:0,

            alertProducts:{
                "imagesUrl": [],
            },
        }
    },
    methods:{

        checkAPI(){
             //從cookie取得token
            var token = document.cookie.replace(/(?:(?:^|.*;\s*)bigtoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            //把cookie放進header
            axios.defaults.headers.common['Authorization'] = token;
            //登入驗證
            axios.post(`${this.url}/api/user/check`)
                .then((res)=>{
                    this.getProducts()
                })
                .catch((error)=>{
                    //失敗傳送回login
                    document.location.href="login.html";
                })
        },

        getProducts(){

            axios.get(`${this.url}/api/${this.path}/admin/products/all`)
            .then((res)=>{
                this.products = res.data.products;
            })
            .catch((error)=>{
                //失敗傳送回login
                console.log(error);
            })
        },

        openProducts(){
            this.alertProducts = {
                "imagesUrl": [],
            };
            productsDom.show();
        },
        enterProducts(){
            //這區是有新增跟編輯


            if(this.alertProducts.id){
                 //此為編輯
                 axios.put(`${this.url}/api/${this.path}/admin/product/${this.alertProducts.id}`,{data:{...this.alertProducts}})
                 .then((res)=>{
                    productsDom.hide();
                    //刷新頁面
                    this.getProducts();
                 })
                 .catch((error)=>{
                    alert(error.data.message);
     
                 }) 
                 
            }
            else
            {   //此為新增
                axios.post(`${this.url}/api/${this.path}/admin/product`,{data:{...this.alertProducts}})
                .then((res)=>{
                    productsDom.hide();
                    //刷新頁面
                    this.getProducts();
                })
                .catch((error)=>{
                    alert(error.data.message);
                })  
            }
        },
        addAlertImg(){
            if(!this.alertProducts.imagesUrl){
                this.alertProducts.imagesUrl = [];
            }
            this.alertProducts.imagesUrl.push('');
        },
        deleteAlertImg(){
            this.alertProducts.imagesUrl.pop();
        },


        editData(id){
            this.alertTitle = 0;

            const data = Object.values(this.products);
            data.forEach((i)=>{
                if(i.id===id){
                    this.alertProducts={
                        ...i
                    }
                }
            })
            productsDom.show();
        },

        openDeleteDom(id){
            const data = Object.values(this.products);
            data.forEach((i)=>{
                if(i.id===id){
                    this.alertProducts={
                        ...i
                    }
                }
            })
            delProductModal.show();
        },

        DeleteData(){
            axios.delete(`${this.url}/api/${this.path}/admin/product/${this.alertProducts.id}`,{data:{...this.alertProducts}})
                 .then((res)=>{
                    delProductModal.hide();
                    //刷新頁面
                    this.alertProducts={
                        "imagesUrl": [],
                    };
                    this.getProducts();
                 })
                 .catch((error)=>{
                     console.log(error);
     
                 }) 
        }
    },
    mounted(){
        //抓取dom 元素
        productsDom  = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
        
        this.checkAPI();
        
        
    }
})

app.mount('#app');