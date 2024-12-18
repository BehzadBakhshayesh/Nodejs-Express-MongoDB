class APIFeaturs {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        const { sort, fields, page, limit, ...filters } = this.queryString;
        const filterQuery = JSON.parse(
            JSON.stringify(filters).replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        );
        this.query.find(filterQuery);
        return this
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createAt');
        }
        return this
    }

    limitFields() {
        if (this.queryString.fields) {
            const queryFields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(queryFields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this
    }

    paginate() {
        const queryPage = Math.max(parseInt(this.queryString.page ?? 1), 1);
        const queryLimit = Math.max(parseInt(this.queryString.limit ?? 5), 1);
        const skip = (queryPage - 1) * queryLimit;
        this.query = this.query.skip(skip).limit(queryLimit);
        return this
    }


}

module.exports = APIFeaturs