package com.altruist.action;


import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;

import com.altruist.entity.Login;

public class LoginTable 
{
private String user;
private String pass;
private List<Login> loginlist;

public String getUser() {
	return user;
}
public void setUser(String user) {
	this.user = user;
}
public String getPass() {
	return pass;
}
public void setPass(String pass) {
	this.pass = pass;
}

public String execute()
{
	String result="";
	try
	{
		Login login= new Login(user,pass);
		Configuration configuration= new Configuration();
		configuration.configure("hibernate.cfg.xml");
		StandardServiceRegistryBuilder builder= new StandardServiceRegistryBuilder().applySettings(configuration.getProperties());
		SessionFactory sessionFactory= configuration.buildSessionFactory(builder.build());
		Session session= sessionFactory.openSession();
		Transaction transaction= session.beginTransaction();
		session.save(login);
		transaction.commit();
		String hql="from com.altruist.entity.Login";
		Query query=session.createQuery(hql);
		loginlist= query.list();
		session.close();
		result="success";
	}
	catch(Exception e)
	{
		e.printStackTrace();
	}
	return result;
}
public List<Login> getLoginlist() {
	return loginlist;
}
public void setLoginlist(List<Login> loginlist) {
	this.loginlist = loginlist;
}

}
