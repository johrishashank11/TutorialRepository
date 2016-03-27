package com.altruist.hibernate.mapping;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="iuser")
public class IUser 
{
	@Id
	@Column(name="id")
	private int id;
	
	@Column(name="login")
	private String login;
	
	@Column(name="pwd")
	private String pwd;
	
	@Column(name="roleid")
	private int roleid;
	
	@Column(name="refdata")
	private String refdata;
	
	@Column(name="status")
	private int status;
	
	@Column(name="ipaddr")
	private String ipaddr;
	
	@Column(name="logstatus")
	private String logstatus;
	
	@Column(name="remarks")
	private String remarks;
	
	@Column(name="addtime")
	private Date addtime;
	
	@Column(name="edittime")
	private Date edittime;
	
	@Column(name="editby")
	private String editby;
	
	@Column(name="drm")
	private int drm;
	
	@Column(name="resendcount")
	private String resendcount;
	
	@Column(name="telcoid")
	private String telcoid;
	
	@Column(name="linkcreatorid")
	private String linkcreatorid;
	
	@Column(name="language")
	private String language;
	
	@Column(name="ocg_status")
	private int ocg_status;
	
	@Column(name="ocg_update_status")
	private int ocg_update_status;
	
	@Column(name="sms_status")
	private int sms_status;
	
	@Column(name="sms_update_status")
	private int sms_update_status;
	
	@Column(name="cpid")
	private String cpid;
	
	@Column(name="download_prid")
	private String download_prid;
	
	@Column(name="pr_id")
	private String pr_id;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public int getRoleid() {
		return roleid;
	}

	public void setRoleid(int roleid) {
		this.roleid = roleid;
	}

	public String getRefdata() {
		return refdata;
	}

	public void setRefdata(String refdata) {
		this.refdata = refdata;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getIpaddr() {
		return ipaddr;
	}

	public void setIpaddr(String ipaddr) {
		this.ipaddr = ipaddr;
	}

	public String getLogstatus() {
		return logstatus;
	}

	public void setLogstatus(String logstatus) {
		this.logstatus = logstatus;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public Date getAddtime() {
		return addtime;
	}

	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}

	public Date getEdittime() {
		return edittime;
	}

	public void setEdittime(Date edittime) {
		this.edittime = edittime;
	}

	public String getEditby() {
		return editby;
	}

	public void setEditby(String editby) {
		this.editby = editby;
	}

	public int getDrm() {
		return drm;
	}

	public void setDrm(int drm) {
		this.drm = drm;
	}

	public String getResendcount() {
		return resendcount;
	}

	public void setResendcount(String resendcount) {
		this.resendcount = resendcount;
	}

	public String getTelcoid() {
		return telcoid;
	}

	public void setTelcoid(String telcoid) {
		this.telcoid = telcoid;
	}

	public String getLinkcreatorid() {
		return linkcreatorid;
	}

	public void setLinkcreatorid(String linkcreatorid) {
		this.linkcreatorid = linkcreatorid;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public int getOcg_status() {
		return ocg_status;
	}

	public void setOcg_status(int ocg_status) {
		this.ocg_status = ocg_status;
	}

	public int getOcg_update_status() {
		return ocg_update_status;
	}

	public void setOcg_update_status(int ocg_update_status) {
		this.ocg_update_status = ocg_update_status;
	}

	public int getSms_status() {
		return sms_status;
	}

	public void setSms_status(int sms_status) {
		this.sms_status = sms_status;
	}

	public int getSms_update_status() {
		return sms_update_status;
	}

	public void setSms_update_status(int sms_update_status) {
		this.sms_update_status = sms_update_status;
	}

	public String getCpid() {
		return cpid;
	}

	public void setCpid(String cpid) {
		this.cpid = cpid;
	}

	public String getPr_id() {
		return pr_id;
	}

	public void setPr_id(String pr_id) {
		this.pr_id = pr_id;
	}

	public String getDownload_prid() {
		return download_prid;
	}

	public void setDownload_prid(String download_prid) {
		this.download_prid = download_prid;
	}

}
