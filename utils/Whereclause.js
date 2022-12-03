//base -product.find()
//bigQ- url parmas



//i, q,. global search keyword
class WhereClause {
    constructor(base, bigQ) {
        this.base = base;
        this.bigQ = bigQ
    }
    search() {
        const searchkeyword = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $options: 'i'
            }
        } : {}

        this.base = this.base.find({ ...searchkeyword })
        return this;
    }

    filter() {
        const copyQ = { ...this.bigQ };
        delete copyQ["search"];
        delete copyQ["limit"];
        delete copyQ["page"];

        let stringOfCopyQ = JSON.stringify(copyQ);
        stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g,(m) => `$${m}`)

        const jsonOfCopy = JSON.parse(stringOfCopyQ);
        this.base = this.base.find(jsonOfCopy);
        return this;
    }

    pager(resultperpage) {
        let currentPage = 1
        if (this.bigQ.page) {
            currentPage = this.bigQ.page;
        }
        //formula 
        const skipVal = resultperpage * (currentPage - 1);

        this.base = this.base.limit(resultperpage).skip(skipVal);
        return this;
    }

}


module.exports=WhereClause;
