import { useState, useEffect } from "react";
import { Star, Grid3X3, List, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

// 模拟收藏的知识数据
const mockFavoriteItems: KnowledgeItem[] = [
  {
    id: "1",
    title: "React Hooks 最佳实践",
    content: "React Hooks 是React 16.8版本引入的新特性，它允许你在不编写类组件的情况下使用状态和其他React特性。本文将深入探讨使用Hooks的最佳实践...",
    tags: ["React", "前端", "JavaScript", "开发"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    isFavorite: true
  },
  {
    id: "3",
    title: "设计系统构建指南",
    content: "一个优秀的设计系统能够提高团队协作效率，保证产品视觉一致性。本指南将从零开始教你如何构建和维护设计系统...",
    tags: ["设计", "UI/UX", "组件库"],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16",
    isFavorite: true
  },
  {
    id: "5",
    title: "性能优化策略",
    content: "Web应用性能优化是提升用户体验的重要手段。从加载速度到运行效率，本文将介绍全面的性能优化策略和实践方法...",
    tags: ["性能优化", "前端", "用户体验"],
    createdAt: "2024-01-03",
    updatedAt: "2024-01-12",
    isFavorite: true
  }
];

const popularTags = ["React", "前端", "设计", "UI/UX", "性能优化"];
const sortOptions = [
  { value: "newest", label: "最新收藏" },
  { value: "oldest", label: "最早收藏" },
  { value: "alphabetical", label: "字母顺序" }
];

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [favoriteItems, setFavoriteItems] = useState<KnowledgeItem[]>(mockFavoriteItems);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  // 过滤和排序收藏项
  const filteredAndSortedItems = favoriteItems
    .filter(item => {
      // 根据搜索词过滤
      const matchesSearch = searchQuery
        ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // 根据标签过滤
      const matchesTag = !selectedTag || item.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const handleCardClick = (item: KnowledgeItem) => {
    toast({
      title: "查看收藏内容",
      description: `正在查看: ${item.title}`,
    });
  };

  const handleRemoveFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
    
    // 从收藏列表中移除
    setFavoriteItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "已移除收藏",
      description: "内容已从收藏夹中移除",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Favorites Header */}
        <div className="bg-card border-b border-border/50 py-6">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-6 w-6 text-yellow-500" />
              <h1 className="text-2xl font-bold">我的收藏</h1>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <Input
                placeholder="搜索我的收藏..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background border-border/50 focus:border-primary transition-colors"
              />
              <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Filters and Results */}
        <div className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Tabs */}
            <Tabs defaultValue="all" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">全部收藏</TabsTrigger>
                <TabsTrigger value="recent">最近收藏</TabsTrigger>
              </TabsList>
            </Tabs>
            
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
                  <span className="text-sm text-muted-foreground">排序:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
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
                收藏内容
                <span className="text-muted-foreground ml-2">({filteredAndSortedItems.length})</span>
              </h2>
            </div>

            {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-16 bg-card/50 rounded-lg border border-border/50">
                <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <div className="text-muted-foreground text-lg mb-2">
                  {searchQuery || selectedTag ? "未找到匹配的收藏内容" : "收藏夹是空的"}
                </div>
                <p className="text-muted-foreground/70 mb-6 max-w-md mx-auto">
                  {searchQuery || selectedTag 
                    ? "尝试使用不同的关键词或筛选条件，或者浏览所有收藏"
                    : "浏览知识库并收藏你感兴趣的内容"}
                </p>
                {(searchQuery || selectedTag) && (
                  <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedTag(null); }}>
                    清除筛选条件
                  </Button>
                )}
                {!searchQuery && !selectedTag && (
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
                    <KnowledgeCard
                      item={item}
                      onClick={() => handleCardClick(item)}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleRemoveFavorite(item.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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