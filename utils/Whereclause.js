//base -product.find()
//bigQ- url parmas
//i, q,. global search keyword
class WhereClause{
    constructor(base,bigQ){
        this.base=base;
        this.bigQ=bigQ
    }
search()
{
    const searchkeyword=this.bigQ.search ? {
        name:{
            $regex:this.bigQ.search,
            $options:'i'
        }
    }:{}

    this.base=this.base.find({ ...searchkeyword})
    return this;
}
    

}



