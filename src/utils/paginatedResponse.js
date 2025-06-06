const paginatedResponse = async (model, query, filter = {}, populate = null) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
  
    const total = await model.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    let data = model.find(filter)
    if (populate){
      data = data.populate(populate)
    }
    data = await data.skip(skip).limit(limit);
  
    return { data, total, page, limit, totalPages };
  };
  
  module.exports = { paginatedResponse };
  