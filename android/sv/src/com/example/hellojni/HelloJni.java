/*
 * Copyright (C) 2009 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.example.hellojni;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;

import com.siteview.jsvapi.Jsvapi;

public class HelloJni extends Activity
{
	static
	{
		System.loadLibrary("hello-jni");
	}
	
	@Override
	public void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		
		TextView tv = new TextView(this);
		tv.setText(HelloJni.test());
		setContentView(tv);
	}
	
	public static String test()
	{
		String ret = new String();
		//指定 svdb 地址的设置文件
		String fname = "/mnt/sdcard/svapi.ini";
		boolean isok = setSvdbAddrByFile(fname);
		if (!isok)
			ret += "Failed to ";
		ret += "set svdb addr in: " + fname + "\n";
		ret += "svdb addr is:" + getSvdbAddr() + "\n\n";
		ret += getMonitorTemplet() + "\n\n";
		ret += SubmitGroup() + "\n\n";
		ret += GetTreeData() + "\n\n";	
		return ret;
	}
	
	public static void putMapIgnorNull(Map map, String key, String value)
	{
		if (key != null)
			map.put(key, value);
	}
	
	public static String getMapInStr(Map<String, String> ndata)
	{
		if (ndata == null)
			return "";
		
		StringBuilder ret = new StringBuilder();
		for (String key : ndata.keySet())
			ret.append("  " + key + "= \"" + ndata.get(key) + "\"\n");
		return ret.toString();
	}
	
	public static String getSvdbAddr()
	{
		Map<String, Map<String, String>> fmap = new HashMap<String, Map<String, String>>();
		Map<String, String> ndata = new HashMap<String, String>();
		StringBuilder estr = new StringBuilder();
		
		ndata.put("dowhat", "GetSvdbAddr");
		
		boolean ret = Jsvapi.getInstance().GetUnivData(fmap, ndata, estr);
		if (ret && fmap.get("return") != null)
			return fmap.get("return").get("return");
		
		return "";
	}
	
	public static boolean setSvdbAddrByFile(String filename)
	{
		Map<String, Map<String, String>> fmap = new HashMap<String, Map<String, String>>();
		Map<String, String> ndata = new HashMap<String, String>();
		StringBuilder estr = new StringBuilder();
		
		ndata.put("dowhat", "SetSvdbAddrByFile");
		if (filename != null)
			ndata.put("filename", filename);
		
		boolean ret = Jsvapi.getInstance().GetUnivData(fmap, ndata, estr);
		
		// if(!ret)
		// throw new Exception(estr.toString());
		return ret;
	}
	
	public static String getMonitorTemplet()
	{
		String id = "1";
		
		Map<String, Map<String, String>> fmap = new HashMap<String, Map<String, String>>();
		Map<String, String> ndata = new HashMap<String, String>();
		StringBuilder estr = new StringBuilder();
		
		ndata.put("dowhat", "GetMonitorTemplet");
		putMapIgnorNull(ndata, "id", id);
		boolean ret = Jsvapi.getInstance().GetUnivData(fmap, ndata, estr);
		
		// if (!ret)
		// throw new Exception(estr.toString());
		// return fmap;
		
		if (!ret)
			return estr.toString();
		
		if (fmap.get("property") != null)
		{
			String text = "GetMonitorTemplet, sv_id= " + fmap.get("property").get("sv_id");
			text += "\nsv_description= " + fmap.get("property").get("sv_description");
			text += "\nsv_dll= " + fmap.get("property").get("sv_dll");
			
			return text;
		}
		
		return new String("data of GetMonitorTemplet error");
	}
	
	public static String GetTreeData()
	{
		String id = "1";
		
		List<Map<String, String>> fmap = new ArrayList<Map<String, String>>();
		Map<String, String> ndata = new HashMap<String, String>();
		StringBuilder estr = new StringBuilder();
		
		ndata.put("dowhat", "GetTreeData");
		putMapIgnorNull(ndata, "parentid", id);
		putMapIgnorNull(ndata, "onlySon", "true");
		boolean ret = Jsvapi.getInstance().GetForestData(fmap, ndata, estr);
		
		// if (!ret)
		// throw new Exception(estr.toString());
		// return fmap;
		
		if (!ret)
			return estr.toString();
		
		if (fmap.size() != 0 && fmap.get(0) != null)
		{
			String text = "GetTreeData, " + getMapInStr(fmap.get(0));
			return text;
		}
		
		return new String("data of GetTreeData error");
	}
	
	public static String SubmitGroup()
	{
		String id = "1";
		
		Map<String, Map<String, String>> fmap = new HashMap<String, Map<String, String>>();
		Map<String, String> ndata = new HashMap<String, String>();
		StringBuilder estr = new StringBuilder();
		
		Map<String, String> property = new HashMap<String, String>();
		putMapIgnorNull(property, "sv_name", "android测试");
		putMapIgnorNull(property, "sv_description", "android测试");
		fmap.put("property", property);

		Map<String, String> retdata = new HashMap<String, String>();
//		putMapIgnorNull(retdata, "id", "1.36");
		fmap.put("return", retdata);
		
		ndata.put("dowhat", "SubmitGroup");
		putMapIgnorNull(ndata, "parentid", "1");
		boolean ret = Jsvapi.getInstance().SubmitUnivData(fmap, ndata, estr);
		
		// if (!ret)
		// throw new Exception(estr.toString());
		// return fmap;
		
		if (!ret)
			return estr.toString();
		
		if (fmap.get("property") != null)
		{
//			String text = "SubmitGroup, sv_id= " + fmap.get("property").get("sv_id");
//			text += "\nsv_description= " + fmap.get("property").get("sv_description");
//			
//			return text;
			
			String text = "SubmitGroup, " + getMapInStr(fmap.get("property"));
			return text;
		}
		
		return new String("data of SubmitGroup error");
	}
}
