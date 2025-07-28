import { useState, useEffect } from "react";
import { Plus, Search, Filter, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/knowledge-hero.jpg";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 模拟知识数据
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

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(mockKnowledgeItems);
  const { toast } = useToast();

  // 过滤知识项
  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || item.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCreateNew = () => {
    toast({
      title: "创建新知识",
      description: "新建知识功能即将推出...",
    });
  };

  const handleCardClick = (item: KnowledgeItem) => {
    toast({
      title: "查看知识详情",
      description: `正在查看: ${item.title}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-hero opacity-90"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(8, 182, 212, 0.8)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10 px-8 py-16 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-float">
            智慧知识管理
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            构建你的专属知识库，让智慧沉淀，让创意流动
          </p>
          <Button 
            onClick={handleCreateNew}
            variant="hero" 
            size="lg" 
            className="text-lg px-8 py-4"
          >
            <Plus className="mr-2 h-5 w-5" />
            开始创建
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索知识内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card border-border/50 focus:border-primary transition-colors"
              />
            </div>

            {/* View Toggle */}
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

          {/* Popular Tags */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">热门标签</h3>
            <div className="flex flex-wrap gap-2">
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
          </div>
        </div>

        {/* Knowledge Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              知识内容 
              <span className="text-muted-foreground ml-2">({filteredItems.length})</span>
            </h2>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground text-lg mb-4">
                {searchQuery || selectedTag ? "未找到匹配的知识内容" : "暂无知识内容"}
              </div>
              <Button onClick={handleCreateNew} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                创建第一个知识
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredItems.map((item) => (
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
  );
}