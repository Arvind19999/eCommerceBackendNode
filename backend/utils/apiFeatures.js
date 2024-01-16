class Apifeatures{
    constructor(query,queryStr){
        this.query  = query;
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword?{
            name :{
                $regex  : this.queryStr.keyword,
                $options : "i"
            }
        }:{};

        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr}
        // ⁡⁢⁢⁢𝗥𝗲𝗺𝗼𝘃𝗶𝗻𝗴 𝗦𝗼𝗺𝗲 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆⁡
        const removableFields = ["keyword","page","limit"]
        removableFields.forEach(key=> delete queryCopy[key])
    
        // ⁡⁢⁢⁢𝗙𝗶𝗹𝘁𝗲𝗿 𝘄𝗶𝘁𝗵 𝗽𝗿𝗶𝗰𝗲⁡
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)

        this.query = this.query.find(JSON.parse(queryStr))
        console.log(queryStr)
        return this;
    }
    pagination(itemsPerPage){
        const currentPage   =  Number(this.queryStr.page) || 1;
        const skipItems =  itemsPerPage * (currentPage - 1);
        this.query = this.query.limit(itemsPerPage).skip(skipItems) 
        return this;
    }
};


module.exports = Apifeatures;