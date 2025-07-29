import { useState, useEffect } from "react";
import { Tag as TagIcon, Search as SearchIcon, Grid3X3, List, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KnowledgeCard } from "@/components/KnowledgeCard";

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

// 从知识数据中提取所有唯一标签
const extractAllTags = (items: KnowledgeItem[]) => {
  const allTags = items.flatMap(item => item.tags);
  const uniqueTags = Array.from(new Set(allTags));
  return uniqueTags.sort();
};

// 计算每个标签关联的知识项数量
const calculateTagCounts = (items: KnowledgeItem[]) => {
  const tagCounts: Record<string, number> = {};
  
  items.forEach(item => {
    item.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return tagCounts;
};

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(mockKnowledgeItems);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();

  // 初始化标签数据
  useEffect(() => {
    const tags = extractAllTags(knowledgeItems);
    setAllTags(tags);
    
    const counts = calculateTagCounts(knowledgeItems);
    setTagCounts(counts);
  }, [knowledgeItems]);

  // 过滤标签
  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 获取与选定标签相关的知识项
  const relatedItems = selectedTag
    ? knowledgeItems.filter(item => item.tags.includes(selectedTag))
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 显示搜索提示
    toast({
      title: "搜索结果",
      description: `找到 ${filteredTags.length} 个相关标签`,
    });
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleCardClick = (item: KnowledgeItem) => {
    toast({
      title: "查看知识详情",
      description: `正在查看: ${item.title}`,
    });
  };

  const handleCreateTag = () => {
    toast({
      title: "创建新标签",
      description: "新建标签功能即将推出...",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Tags Header */}
        <div className="bg-card border-b border-border/50 py-6">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">所有标签</h1>
              <Button onClick={handleCreateTag} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                创建标签
              </Button>
            </div>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="搜索标签..."
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

        {/* Tags Content */}
        <div className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {selectedTag ? (
              // 显示选定标签的相关知识项
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">标签:</h2>
                    <Badge className="px-3 py-1 text-base">
                      {selectedTag}
                      <X 
                        className="h-4 w-4 ml-2 cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTag(null);
                        }}
                      />
                    </Badge>
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

                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground">
                    相关知识
                    <span className="text-muted-foreground ml-2">({relatedItems.length})</span>
                  </h3>
                </div>

                {relatedItems.length === 0 ? (
                  <div className="text-center py-16 bg-card/50 rounded-lg border border-border/50">
                    <TagIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <div className="text-muted-foreground text-lg mb-2">
                      未找到相关知识内容
                    </div>
                    <p className="text-muted-foreground/70 mb-6 max-w-md mx-auto">
                      该标签下暂无知识内容
                    </p>
                    <Button variant="outline" onClick={() => setSelectedTag(null)}>
                      返回所有标签
                    </Button>
                  </div>
                ) : (
                  <div className={
                    viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }>
                    {relatedItems.map((item) => (
                      <KnowledgeCard
                        key={item.id}
                        item={item}
                        onClick={() => handleCardClick(item)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // 显示所有标签
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    标签列表
                    <span className="text-muted-foreground ml-2">({filteredTags.length})</span>
                  </h2>
                </div>

                {filteredTags.length === 0 ? (
                  <div className="text-center py-16 bg-card/50 rounded-lg border border-border/50">
                    <TagIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <div className="text-muted-foreground text-lg mb-2">
                      未找到匹配的标签
                    </div>
                    <p className="text-muted-foreground/70 mb-6 max-w-md mx-auto">
                      尝试使用不同的关键词，或者浏览所有标签
                    </p>
                    <Button variant="outline" onClick={() => setSearchQuery("")}>清除搜索</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredTags.map((tag) => (
                      <Card 
                        key={tag} 
                        className="group cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/20"
                        onClick={() => handleTagClick(tag)}
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TagIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="font-medium group-hover:text-primary transition-colors">{tag}</span>
                          </div>
                          <Badge variant="secondary" className="bg-secondary/60">
                            {tagCounts[tag] || 0}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}