import { useState, useEffect } from "react";
import { Search as SearchIcon, Grid3X3, List, Filter, ArrowLeft } from "lucide-react";
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
}

// 模拟知识数据 - 与KnowledgeBase组件中的数据相同
const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: "1",
    title: "React Hooks 最佳实践",
    content: "React Hooks 是React 16.8版本引入的新特性，它允许你在不编写类组件的情况下使用状态和其他React特性。本文将深入探讨使用Hooks的最佳实践...",
    tags: ["React", "前端", "JavaScript", "开发"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  },
  {
    id: "2", 
    title: "TypeScript 进阶技巧",
    content: "TypeScript作为JavaScript的超集，提供了强大的类型系统。掌握高级类型技巧能够让你的代码更加健壮和可维护...",
    tags: ["TypeScript", "编程", "类型系统"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18"
  },
  {
    id: "3",
    title: "设计系统构建指南",
    content: "一个优秀的设计系统能够提高团队协作效率，保证产品视觉一致性。本指南将从零开始教你如何构建和维护设计系统...",
    tags: ["设计", "UI/UX", "组件库"],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16"
  },
  {
    id: "4",
    title: "API 设计原则",
    content: "良好的API设计是后端开发的关键。本文总结了RESTful API设计的核心原则和最佳实践，帮助你设计出易用、可维护的API...",
    tags: ["API", "后端", "架构设计"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-14"
  },
  {
    id: "5",
    title: "性能优化策略",
    content: "Web应用性能优化是提升用户体验的重要手段。从加载速度到运行效率，本文将介绍全面的性能优化策略和实践方法...",
    tags: ["性能优化", "前端", "用户体验"],
    createdAt: "2024-01-03",
    updatedAt: "2024-01-12"
  },
  {
    id: "6",
    title: "数据可视化技术栈",
    content: "数据可视化能够将复杂的数据转化为直观的图表和图形。本文将介绍现代数据可视化的主流技术栈和选择建议...",
    tags: ["数据可视化", "图表", "分析"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-10"
  }
];

const popularTags = ["React", "前端", "设计", "JavaScript", "API", "性能优化"];
const sortOptions = [
  { value: "relevance", label: "相关性" },
  { value: "newest", label: "最新更新" },
  { value: "oldest", label: "最早创建" }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(mockKnowledgeItems);
  const { toast } = useToast();

  // 处理URL参数中的搜索词
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, []);

  // 过滤和排序知识项
  const filteredAndSortedItems = knowledgeItems
    .filter(item => {
      const matchesSearch = searchQuery
        ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      const matchesTag = !selectedTag || item.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // 默认按相关性排序 (简单实现：包含搜索词在标题中的排在前面)
      const aInTitle = a.title.toLowerCase().includes(searchQuery.toLowerCase());
      const bInTitle = b.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (aInTitle && !bInTitle) return -1;
      if (!aInTitle && bInTitle) return 1;
      return 0;
    });

  const handleCardClick = (item: KnowledgeItem) => {
    toast({
      title: "查看知识详情",
      description: `正在查看: ${item.title}`,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 更新URL参数
    const url = new URL(window.location.href);
    if (searchQuery) {
      url.searchParams.set("q", searchQuery);
    } else {
      url.searchParams.delete("q");
    }
    window.history.pushState({}, "", url);

    // 显示搜索提示
    toast({
      title: "搜索结果",
      description: `找到 ${filteredAndSortedItems.length} 条相关内容`,
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Search Header */}
        <div className="bg-card border-b border-border/50 py-6">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-2xl font-bold mb-6">高级搜索</h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="输入关键词搜索知识内容..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background border-border/50 focus:border-primary transition-colors"
                />
              </div>
              <Button type="submit" className="h-12 px-6">
                搜索
              </Button>
            </form>
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
                搜索结果
                <span className="text-muted-foreground ml-2">({filteredAndSortedItems.length})</span>
              </h2>
            </div>

            {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-16 bg-card/50 rounded-lg border border-border/50">
                <SearchIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <div className="text-muted-foreground text-lg mb-2">
                  未找到匹配的知识内容
                </div>
                <p className="text-muted-foreground/70 mb-6 max-w-md mx-auto">
                  尝试使用不同的关键词或筛选条件，或者浏览所有内容
                </p>
                <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedTag(null); }}>
                  清除筛选条件
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredAndSortedItems.map((item) => (
                  <KnowledgeCard
                    key={item.id}
                    item={item}
                    onClick={() => handleCardClick(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}