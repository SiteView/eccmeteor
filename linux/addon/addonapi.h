
#ifndef	NODEAPI_DLL_H_
#define	NODEAPI_DLL_H_


#define SCA_SVAPI 


#include <string>
#include "addon.h"
#include "svdbapi.h"



//���º����ľ���ʹ��˵����鿴 scasvapi.txt ����Ϊ�˱���һ�޸�˵������Ҫ���±��룩



//����ΪһЩͨ�÷���
namespace sca_svapi{

	SCA_SVAPI 
	bool ScaGetUnivData(ForestMap & fmap,  const NodeData & inwhat, string & estr);
	//      �� svdb �����������õ�����       ���������     ���صĴ�����Ϣ ���ڵ���					

	SCA_SVAPI 
	bool ScaSubmitUnivData(ForestMap & fmap, const NodeData & inwhat, string & estr);
	//      �ύ�� svdb ������������/����������     ���������       ���صĴ�����Ϣ ���ڵ���					

	SCA_SVAPI 
	bool ScaGetForestData(ForestList & flist, const NodeData & inwhat, string & estr);
	//      �� svdb �����������õ�������       ���������     ���صĴ�����Ϣ ���ڵ���	


	//ɾ���ַ���ǰ��Ŀո�
	SCA_SVAPI 
	std::string TrimSpace(const std::string & input);

	//��������� NodeData �в���ֵ
	SCA_SVAPI 
	string GetValueInNodeData(const NodeData & inwhat,string key,string & estr);

	//���� NodeData
	SCA_SVAPI 
	void PutValueInNodeData(NodeData & inwhat,string key,string value);

	//�� ForestMap �в���ֵ
	SCA_SVAPI 
	string GetValueInForestMap(const ForestMap & fmap, string section, string key, string & estr );

	//���÷��ص� ForestMap
	SCA_SVAPI 
	void PutReturnForestMap(ForestMap & fmap, string section, string key, string value);

	//�� svapi �� MAPNODE ת���� ForestMap	
	SCA_SVAPI 
	bool PutMapnodeIntoForestMap(ForestMap & fmap, string section, MAPNODE ma);

	//�� MAPNODE �е� ��sv_dependson�������� ��sv_dependson_text��
	SCA_SVAPI 
	bool PutSvDependsonText(ForestMap & fmap, string section, MAPNODE ma);

}// end of namespace sca_svapi



#endif




