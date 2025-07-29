import { useState } from "react";
import { Settings as SettingsIcon, Moon, Sun, Bell, BellOff, Globe, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // 主题设置
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("zh-CN");
  
  // 通知设置
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [notifyOnUpdates, setNotifyOnUpdates] = useState(true);
  const [notifyOnComments, setNotifyOnComments] = useState(true);
  
  // 隐私设置
  const [shareUsageData, setShareUsageData] = useState(false);
  const [showRecentActivity, setShowRecentActivity] = useState(true);
  
  // 存储设置
  const [autoBackup, setAutoBackup] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState("weekly");
  
  const handleSaveSettings = () => {
    // 这里实现保存设置的逻辑
    toast({
      title: "设置已保存",
      description: "您的偏好设置已成功更新",
    });
  };

  const handleResetSettings = () => {
    // 重置所有设置为默认值
    setDarkMode(false);
    setLanguage("zh-CN");
    setEmailNotifications(true);
    setDesktopNotifications(true);
    setNotifyOnUpdates(true);
    setNotifyOnComments(true);
    setShareUsageData(false);
    setShowRecentActivity(true);
    setAutoBackup(false);
    setBackupFrequency("weekly");
    
    toast({
      title: "设置已重置",
      description: "所有设置已恢复为默认值",
    });
  };

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">设置</h1>
            <p className="text-sm text-muted-foreground">
              管理您的账户设置和偏好
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">常规</TabsTrigger>
            <TabsTrigger value="notifications">通知</TabsTrigger>
            <TabsTrigger value="privacy">隐私</TabsTrigger>
            <TabsTrigger value="storage">存储</TabsTrigger>
          </TabsList>
          
          {/* 常规设置 */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>常规设置</CardTitle>
                <CardDescription>
                  配置应用的基本设置和外观
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">深色模式</Label>
                    <p className="text-sm text-muted-foreground">
                      切换应用的深色/浅色主题
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                    <Moon className="h-4 w-4" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="language">语言</Label>
                    <p className="text-sm text-muted-foreground">
                      选择应用界面语言
                    </p>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[180px]">
                      <Globe className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="选择语言" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">简体中文</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="ja-JP">日本語</SelectItem>
                      <SelectItem value="ko-KR">한국어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 通知设置 */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>通知设置</CardTitle>
                <CardDescription>
                  配置如何接收应用通知
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">电子邮件通知</Label>
                    <p className="text-sm text-muted-foreground">
                      接收重要更新的电子邮件
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="desktop-notifications">桌面通知</Label>
                    <p className="text-sm text-muted-foreground">
                      在桌面上显示应用通知
                    </p>
                  </div>
                  <Switch
                    id="desktop-notifications"
                    checked={desktopNotifications}
                    onCheckedChange={setDesktopNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-updates">知识更新通知</Label>
                    <p className="text-sm text-muted-foreground">
                      当关注的知识内容更新时通知我
                    </p>
                  </div>
                  <Switch
                    id="notify-updates"
                    checked={notifyOnUpdates}
                    onCheckedChange={setNotifyOnUpdates}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-comments">评论通知</Label>
                    <p className="text-sm text-muted-foreground">
                      当有人评论我的知识内容时通知我
                    </p>
                  </div>
                  <Switch
                    id="notify-comments"
                    checked={notifyOnComments}
                    onCheckedChange={setNotifyOnComments}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 隐私设置 */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>隐私设置</CardTitle>
                <CardDescription>
                  管理您的隐私和数据共享偏好
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-usage">共享使用数据</Label>
                    <p className="text-sm text-muted-foreground">
                      允许共享匿名使用数据以改进应用
                    </p>
                  </div>
                  <Switch
                    id="share-usage"
                    checked={shareUsageData}
                    onCheckedChange={setShareUsageData}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-activity">显示最近活动</Label>
                    <p className="text-sm text-muted-foreground">
                      在个人资料中显示您的最近活动
                    </p>
                  </div>
                  <Switch
                    id="show-activity"
                    checked={showRecentActivity}
                    onCheckedChange={setShowRecentActivity}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>数据导出</Label>
                    <p className="text-sm text-muted-foreground">
                      下载您的所有数据副本
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center">
                    导出数据
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 存储设置 */}
          <TabsContent value="storage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>存储设置</CardTitle>
                <CardDescription>
                  管理您的数据存储和备份选项
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-backup">自动备份</Label>
                    <p className="text-sm text-muted-foreground">
                      定期自动备份您的知识库
                    </p>
                  </div>
                  <Switch
                    id="auto-backup"
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>
                
                {autoBackup && (
                  <div className="flex items-center justify-between pl-6">
                    <div className="space-y-0.5">
                      <Label htmlFor="backup-frequency">备份频率</Label>
                      <p className="text-sm text-muted-foreground">
                        选择自动备份的频率
                      </p>
                    </div>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择频率" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">每天</SelectItem>
                        <SelectItem value="weekly">每周</SelectItem>
                        <SelectItem value="monthly">每月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>手动备份</Label>
                    <p className="text-sm text-muted-foreground">
                      创建知识库的即时备份
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    立即备份
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>清理缓存</Label>
                    <p className="text-sm text-muted-foreground">
                      清除本地存储的临时文件
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    清理缓存
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleResetSettings}>
            重置设置
          </Button>
          <Button onClick={handleSaveSettings}>
            保存设置
          </Button>
        </div>
      </div>
    </Layout>
  );
}