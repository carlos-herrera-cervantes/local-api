'use strict';

import R from "ramda";

class Request {

    private queryParams: any;
    private queryFilter: any = {};

    constructor(queryParams: any) {
        this.queryParams = queryParams;
    }

    public setSort(): any {
        if (R.not(R.hasIn('sort', this.queryParams))) {
            this.queryFilter.sort = {};
            return this;
        }

        const sort = this.queryParams.sort;
        const isAscending = sort.includes('-');
        const result = {};
        const property = isAscending ? sort.split('-').pop() : sort;

        result[property] = isAscending ? -1 : 1;
        this.queryFilter.sort = result;

        return this;
    }

    public setPagination(): any {
        const isValidPaginate = 'paginate' in this.queryParams && 'page' in this.queryParams && 'pageSize' in this.queryParams;

        if (R.not(isValidPaginate)) {
            this.queryFilter.pagination = { page: 0, pageSize: 0 };
            return this;
        }

        const { page, pageSize } = this.queryParams;
        const intPage = parseInt(page);
        const intPageSize = parseInt(pageSize);
        const parsePage = intPage == 1 ? 0 : intPage == 0 ? 0 : intPage - 1;

        this.queryFilter.pagination = { page: parsePage * intPageSize, pageSize: intPageSize };
        return this;
    }

    public setCriteria(): any {
        if (R.equals(Object.entries(this.queryParams).length, 0)) {
            this.queryFilter.criteria = {};
            return this;
        }

        const isNotValidCriterias = ['sort', 'paginate', 'page', 'pageSize', 'relation'];
        const result = {};

        Object.entries(this.queryParams).forEach(([key, value]) => {
            if (!isNotValidCriterias.includes(key)) {
                result[key] = value;
            }
        });

        this.queryFilter.criteria = result;
        return this;
    }

    public setRelation(): any {
        if (R.hasIn('relation', this.queryParams)) {
            this.queryFilter.relation = this.queryParams.relation.split(',');
            return this;
        }

        this.queryFilter.relation = [];
        return this;
    }
}

export { Request };