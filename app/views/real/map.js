function(doc) {
 if (doc._id.substr(0,5) === 'real:'){
    emit(doc._id.substr(5), {
		
		"id": doc._id,
		"rev": doc._rev,
		
    	"name": doc.name,
    	"call": doc.call,
    	"sale": doc.sale,
    	"qaType": doc.qaType,
    	"score": doc.score,
    	"pip": doc.pip,
    	"notes": doc.notes,
    });	
  }
};