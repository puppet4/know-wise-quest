import { useState, useEffect } from "react";
import { Clock, Grid3X3, List, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastVisited: string; // 最后访问时间
}

// 模拟最近访问的知识数据
const mockRecentItems: KnowledgeItem[] = [
  {
    id: "2", 
    title: "TypeScript 进阶技巧",
    content: "TypeScript作为JavaScript的超集，提供了强大的类型系统。掌握高级类型技巧能够让你的代码更加健壮和可维护...",
    tags: ["TypeScript", "编程", "类型系统"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    lastVisited: "2024-01-25 14:30"
  },
  {
    id: "5",
    title: "性能优化策略",
    content: "Web应用性能优化是提升用户体验的重要手段。从加载速度到运行效率，本文将介绍全面的性能优化策略和实践方法...",
    tags: ["性能优化", "前端", "用户体验"],
    createdAt: "2024-01-03",
    updatedAt: "2024-01-12",
    lastVisited: "2024-01-25 10:15"
  },
  {
    id: "1",
    title: "React Hooks 最佳实践",
    content: "React Hooks 是React 16.8版本引入的新特性，它允许你在不编写类组件的情况下使用状态和其他React特性。本文将深入探讨使用Hooks的最佳实践...",
    tags: ["React", "前端", "JavaScript", "开发"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    lastVisited: "2024-01-24 16:45"
  },
  {
    id: "4",
    title: "API 设计原则",
    content: "良好的API设计是后端开发的关键。本文总结了RESTful API设计的核心原则和最佳实践，帮助你设计出易用、可维护的API...",
    tags: ["API", "后端", "架构设计"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-14",
    lastVisited: "2024-01-23 09:20"
  }
];

const popularTags = ["React", "前端", "TypeScript", "API", "性能优化"];
const timeFilterOptions = [
  { value: "today", label: "今天" },
  { value: "week", label: "本周" },
  { value: "month", label: "本月" },
  { value: "all", label: "全部时间" }
];

export default function RecentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [timeFilter, setTimeFilter] = useState("all");
  const [recentItems, setRecentItems] = useState<KnowledgeItem[]>(mockRecentItems);
  const { toast } = useToast();

  // 过滤和排序最近访问项
  const filteredAndSortedItems = recentItems
    .filter(item => {
      // 根据搜索词过滤
      const matchesSearch = searchQuery
        ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // 根据标签过滤
      const matchesTag = !selectedTag || item.tags.includes(selectedTag);
      
      // 根据时间过滤
      const lastVisitDate = new Date(item.lastVisited);
      const now = new Date();
      let matchesTime = true;
      
      if (timeFilter === "today") {
        // 今天
        matchesTime = (
          lastVisitDate.getDate() === now.getDate() &&
          lastVisitDate.getMonth() === now.getMonth() &&
          lastVisitDate.getFullYear() === now.getFullYear()
        );
      } else if (timeFilter === "week") {
        // 本周 (过去7天)
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchesTime = lastVisitDate >= weekAgo;
      } else if (timeFilter === "month") {
        // 本月 (过去30天)
        const monthAgo = new Date();
        monthAgo.setDate(now.getDate() - 30);
        matchesTime = lastVisitDate >= monthAgo;
      }
      // "all" 不需要额外过滤
      
      return matchesSearch && matchesTag && matchesTime;
    })
    // 按最近访问时间排序
    .sort((a, b) => new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime());

  const handleCardClick = (item: KnowledgeItem) => {
    // 更新最后访问时间
    const updatedItems = recentItems.map(i => {
      if (i.id === item.id) {
        return {
          ...i,
          lastVisited: new Date().toLocaleString()
        };
      }
      return i;
    });
    setRecentItems(updatedItems);
    
    toast({
      title: "查看知识内容",
      description: `正在查看: ${item.title}`,
    });
  };

  const handleClearHistory = () => {
    setRecentItems([]);
    toast({
      title: "历史记录已清空",
      description: "所有最近访问记录已被清除",
    });
  };

  const handleRemoveFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
    
    // 从历史记录中移除
    setRecentItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "已移除记录",
      description: "内容已从最近访问中移除",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Recent Header */}
        <div className="bg-card border-b border-border/50 py-6">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl font-bold">最近访问</h1>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearHistory}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                清空历史
              </Button>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <Input
                placeholder="搜索最近访问的内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background border-border/50 focus:border-primary transition-colors"
              />
              <History className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Filters and Results */}
        <div className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground">标签:</span>
                <Badge
                  variant={selectedTag === null ? "default" : "outline"}
                  className="cursor-pointer transition-colors hover:bg-primary/10"
                  onClick={() => setSelectedTag(null)}
                >
                  全部
                </Badge>
                {popularTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary/10"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">时间:</span>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="时间范围" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeFilterOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                访问历史
                <span className="text-muted-foreground ml-2">({filteredAndSortedItems.length})</span>
              </h2>
            </div>

            {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-16 bg-card/50 rounded-lg border border-border/50">
                <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <div className="text-muted-foreground text-lg mb-2">
                  {searchQuery || selectedTag || timeFilter !== "all" ? "未找到匹配的访问记录" : "暂无访问记录"}
                </div>
                <p className="text-muted-foreground/70 mb-6 max-w-md mx-auto">
                  {searchQuery || selectedTag || timeFilter !== "all" 
                    ? "尝试使用不同的关键词或筛选条件，或者查看所有历史记录"
                    : "浏览知识库内容后，将在此处显示您的访问历史"}
                </p>
                {(searchQuery || selectedTag || timeFilter !== "all") && (
                  <Button variant="outline" onClick={() => { 
                    setSearchQuery(""); 
                    setSelectedTag(null); 
                    setTimeFilter("all");
                  }}>
                    清除筛选条件
                  </Button>
                )}
                {!searchQuery && !selectedTag && timeFilter === "all" && (
                  <Button variant="default" onClick={() => window.location.href = "/"}>
                    浏览知识库
                  </Button>
                )}
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredAndSortedItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-blue-500/10 to-transparent py-1 px-3 text-xs text-muted-foreground z-10 rounded-t-md">
                      访问于: {item.lastVisited}
                    </div>
                    <div className="pt-6">
                      <KnowledgeCard
                        item={item}
                        onClick={() => handleCardClick(item)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-8 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleRemoveFromHistory(item.id, e)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}