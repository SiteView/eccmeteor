Handlebars.registerHelper('getChildrenNodesByIdAndType', function(id,subtype) {
	var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(id,subtype);
	return SvseTreeDao.getNodesByIds(childrenIds);
});