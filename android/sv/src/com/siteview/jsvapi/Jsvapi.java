package com.siteview.jsvapi;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class Jsvapi
{
//	private final static Logger	logger	= Logger.getLogger(Jsvapi.class);
	private static Jsvapi		admin;
	static
	{
//		try
//		{
//			System.loadLibrary("swigsvapi");
//		} catch (Exception e)
//		{
//			System.err.println("Native code library failed to load. See the chapter on Dynamic Linking Problems in the SWIG Java documentation for help." + e);
//			e.printStackTrace();
//			System.exit(1);
//		}
	}
	
	public static Jsvapi getInstance()
	{
		if (admin == null)
		{
			admin = new Jsvapi();
			admin.setServerAddr();
		}
		return admin;
	}
	
	public void setServerAddr()
	{
		Map<String, Map<String, String>> fmap = new HashMap<String, Map<String, String>>();
		Map<String, String> ndata = new HashMap<String, String>();
		StringBuilder estr = new StringBuilder();
		
		ndata.put("dowhat", "SetSvdbAddrByFile");
		ndata.put("filename", "svapi.ini");
		boolean ret = GetUnivData(fmap, ndata, estr);
		
		// DisplayUtilMapInMap(fmap);
		// logger.info("SetSvdbAddrByFile:" + ret);
		// logger.info("estr:" + estr);
	}
	
	/**
	 * 本函数的功能：获取与 svdb 通讯的强制地址。
	 */
	public void test2()
	{
		Jsvapi svapi = new Jsvapi();
		Map<String, Map<String, String>> fmap = new HashMap<String, Map<String, String>>();
		Map<String, String> ndata = new HashMap<String, String>();
		StringBuilder estr = new StringBuilder();
		
		ndata.put("dowhat", "GetSvdbAddr");
		boolean ret = svapi.GetUnivData(fmap, ndata, estr);
		
		DisplayUtilMapInMap(fmap);
		// logger.info("GetUnivData:" + ret);
		// logger.info("estr:" + estr);
	}
	
	/**
	 * swig 封装的 svapi , 此构造函数装载 svapi.dll 等到 jvm 中,并为模板数据缓存初始化
	 */
	public Jsvapi()
	{
		
	}
	
	/**
	 * 此函数对应于 scasvapi.h(即scasvapi.dll) 中的 c++ 函数 GetUnivData
	 * 
	 * @fmap 从 svdb 服务器请求获得的数据
	 * @inwhat 传入的请求
	 * @estr 返回的错误信息 便于调试
	 * 
	 */
	public boolean GetUnivData(Map<String, Map<String, String>> fmap, Map<String, String> inwhat, StringBuilder estr)
	{
		boolean gocache = false;
		try
		{
			String dowhat = inwhat.get("dowhat");
			if (dowhat.contains("LoadResource") || dowhat.contains("MonitorTemplet") || dowhat.contains("EntityTemplet") || dowhat.contains("EntityGroup"))
				gocache = true;
		} catch (Exception e)
		{
		}
		// if (gocache)
		// return GetUnivData_Cache(fmap, inwhat, estr);
		
		StringMap smap = UtilMapToStringMap(inwhat);
		ForestMap fsmap = new ForestMap();
		MyString mestr = new MyString();
		
		boolean ret = swig.swig_GetUnivData(fsmap, smap, mestr);
		
		ForestMapToUtilMapInMap(fmap, fsmap);
		estr.delete(0, estr.length());
		estr.append(mestr.getStr());
		return ret;
	}
	
	/**
	 * 此函数对应于 scasvapi.h(即scasvapi.dll) 中的 c++ 函数 SubmitUnivData
	 * 
	 * @fmap 要提交给 svdb 服务器的数据
	 * @inwhat 传入的请求
	 * @estr 返回的错误信息 便于调试
	 * 
	 */
	public boolean SubmitUnivData(Map<String, Map<String, String>> fmap, Map<String, String> inwhat, StringBuilder estr)
	{
		StringMap smap = UtilMapToStringMap(inwhat);
		ForestMap fsmap = UtilMapInMapToForestMap(fmap);
		MyString mestr = new MyString();
		
		boolean ret = swig.swig_SubmitUnivData(fsmap, smap, mestr);
		
		ForestMapToUtilMapInMap(fmap, fsmap);
		estr.delete(0, estr.length());
		estr.append(mestr.getStr());
		return ret;
	}
	
	/**
	 * 此函数对应于 scasvapi.h(即scasvapi.dll) 中的 c++ 函数 GetForestData
	 * 
	 * @fmap 从 svdb 服务器请求获得的树数据
	 * @inwhat 传入的请求
	 * @estr 返回的错误信息 便于调试
	 * 
	 */
	public boolean GetForestData(List<Map<String, String>> vmap, Map<String, String> inwhat, StringBuilder estr)
	{
		StringMap smap = UtilMapToStringMap(inwhat);
		ForestVector fvec = new ForestVector();
		MyString mestr = new MyString();
		
		boolean ret = swig.swig_GetForestData(fvec, smap, mestr);
		
		ForestArrayListToUtilMapInArrayList(vmap, fvec);
		estr.delete(0, estr.length());
		estr.append(mestr.getStr());
		return ret;
	}
	
	/**
	 * 显示 java.util.HashMap 的内容
	 */
	public void DisplayUtilMap(Map<String, String> ndata)
	{
		if (ndata == null)
			return;
		
		// for (String key : ndata.keySet())
		// logger.info("        " + key + "= \"" + ndata.get(key) + "\"");
	}
	
	/**
	 * 显示 java.util.HashMap in HashMap 的内容
	 */
	public void DisplayUtilMapInMap(Map<String, Map<String, String>> fmap)
	{
		if (fmap == null)
			return;
		
		// logger.info("   -- Display UtilMapInMap begin (" + fmap.size() + " node)" + " -- ");
		for (String key : fmap.keySet())
		{
			Map<String, String> ndata = fmap.get(key);
			// logger.info("     ---- " + key + " (" + ndata.size() + " key)" + " ----");
			DisplayUtilMap(ndata);
		}
		// logger.info("   -- Display UtilMapInMap end (" + fmap.size() + " node)" + " -- ");
	}
	
	/**
	 * 显示 java.util.HashMap in List 的内容
	 */
	public void DisplayUtilMapInArrayList(List<Map<String, String>> fmap)
	{
		if (fmap == null)
			return;
		
		// logger.info("   -- Display UtilMapInArrayList begin (" + fmap.size() + " node)" + " -- ");
		for (int key = 0; key < fmap.size(); ++key)
		{
			Map<String, String> ndata = fmap.get(key);
			// logger.info("     ---- No. " + (key + 1) + " (" + ndata.size() + " key)" + " ----");
			DisplayUtilMap(ndata);
		}
		// logger.info("   -- Display UtilMapInArrayList end (" + fmap.size() + " node)" + " -- ");
	}
	
	/**
	 * 将 java.util.HashMap ，转换为 swig 的 StringMap
	 */
	private StringMap UtilMapToStringMap(Map<String, String> ndata)
	{
		StringMap smap = new StringMap();
		if (ndata == null)
			return smap;
		
		for (String key : ndata.keySet())
			smap.set(key, ndata.get(key));
		return smap;
	}
	
	/**
	 * 将 java.util.HashMap in HashMap，转换为 swig 的 ForestMap
	 */
	private ForestMap UtilMapInMapToForestMap(Map<String, Map<String, String>> fmap)
	{
		ForestMap fsmap = new ForestMap();
		if (fmap == null)
			return fsmap;
		
		for (String key : fmap.keySet())
			fsmap.set(key, UtilMapToStringMap(fmap.get(key)));
		return fsmap;
	}
	
	/**
	 * 将 swig 的 StringMap ，转换为 java.util.HashMap
	 */
	private Map<String, String> StringMapToUtilMap(StringMap smap)
	{
		Map<String, String> ndata = new HashMap<String, String>();
		if (smap == null)
			return ndata;
		
		MyBool mb = new MyBool();
		MyString nextkey = new MyString();
		while (swig.swig_SNextKey(smap, nextkey, mb))
		{
			String key = nextkey.getStr();
			ndata.put(key, smap.get(key));
			// Thread.currentThread().yield();
		}
		return ndata;
	}
	
	/**
	 * 将 swig 的 ForestMap ，转换为 java.util.HashMap in HashMap
	 */
	private void ForestMapToUtilMapInMap(Map<String, Map<String, String>> fmap, ForestMap fsmap)
	{
		fmap.clear();
		if (fsmap == null)
			return;
		
		MyBool mb = new MyBool();
		MyString nextkey = new MyString();
		while (swig.swig_FNextKey(fsmap, nextkey, mb))
		{
			String key = nextkey.getStr();
			fmap.put(key, StringMapToUtilMap(fsmap.get(key)));
			// Thread.currentThread().yield();
		}
		return;
	}
	
	/**
	 * 将 swig 的 ForestArrayList ，转换为 java.util.HashMap in List
	 */
	private void ForestArrayListToUtilMapInArrayList(List<Map<String, String>> fmap, ForestVector fvec)
	{
		fmap.clear();
		if (fvec == null)
			return;
		
		long size = fvec.size();
		for (int index = 0; index < size; ++index)
			fmap.add(StringMapToUtilMap(fvec.get(index)));
		
		return;
	}
	
	/**
	 * 显示 swig 封装的数据结构 StringMap 的内容
	 */
	private void DisplayStringMap(StringMap smap)
	{
		if (smap == null)
			return;
		
		MyBool mb = new MyBool();
		MyString nextkey = new MyString();
		while (swig.swig_SNextKey(smap, nextkey, mb))
		{
			String key = nextkey.getStr();
			// logger.info("        " + key + "= \"" + smap.get(key) + "\"");
			// Thread.currentThread().yield();
		}
	}
	
	/**
	 * 显示 swig 封装的数据结构 ForestMap 的内容
	 */
	private void DisplayForestMap(ForestMap fsmap)
	{
		if (fsmap == null)
			return;
		
		// logger.info("   -- Display ForestMap begin (" + fsmap.size() + " node)" + " -- ");
		
		MyBool mb = new MyBool();
		MyString nextkey = new MyString();
		while (swig.swig_FNextKey(fsmap, nextkey, mb))
		{
			// Thread.currentThread().yield();
			String key = nextkey.getStr();
			StringMap smap = null;
			try
			{
				smap = fsmap.get(key);
			} catch (Exception e)
			{
				// logger.info("     Display ForestMap: " + e + " \"" + key + "\"");
				continue;
			}
			// logger.info("     ---- " + key + " (" + smap.size() + " key)" + " ----");
			DisplayStringMap(smap);
		}
		// logger.info("   -- Display ForestMap end   -- ");
	}
}
