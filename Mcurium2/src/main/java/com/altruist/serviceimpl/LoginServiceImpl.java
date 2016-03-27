package com.altruist.serviceimpl;

import java.security.MessageDigest;
import java.util.Iterator;
import java.util.List;

import com.altruist.db.dao.IuserDao;
import com.altruist.db.daoimpl.IuserDaoImpl;
import com.altruist.hibernate.mapping.IUser;
import com.altruist.pojo.Login;
import com.altruist.service.LoginService;
import com.altruist.utils.ComparableNameValue;
import com.altruist.utils.ComparableNameValue.Comparison;

public class LoginServiceImpl extends Login implements LoginService
{
	private IuserDao iuserdao;
	String username;
	String password;
	
	public LoginServiceImpl()
	{
		this.iuserdao=new IuserDaoImpl();
	}
	
	public List<IUser> findLogin() 
	{
		username=getUser();
		System.out.println("Username==" + username);
		List<IUser> listuser=iuserdao.findAll(new ComparableNameValue<String>("login", username, Comparison.Equal));
		return listuser;
	}
	
	public String execute()
	{
		String result="";
		try
		{
			password=getPass();
			System.out.println("Password==" + password);
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(password.getBytes());
			byte[] digest = md.digest();
			StringBuffer sb = new StringBuffer();
			for (byte b : digest) 
			{
				sb.append(String.format("%02x", b & 0xff));
			}
			String pass=sb.toString();
			List<IUser> listiuser=findLogin();
			Iterator<IUser> iterate=listiuser.iterator();
			while(iterate.hasNext())
			{
				IUser iuser=new IUser();
				iuser=(IUser) iterate.next();
				if(iuser.getPwd().equals(pass))
				{
					System.out.println("MD5 Password==" + pass);
					System.out.println("Executed inside if condition");
					result="success";
				}
				else
				{
					result="fail";
				}
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return result;
	}

}
