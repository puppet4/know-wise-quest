import { useState, useEffect } from "react";
import { Archive as ArchiveIcon, Search as SearchIcon, Grid3X3, List, Plus, X, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string; // 归档时间
}

// 模拟已归档知识数据
const mockArchivedItems: KnowledgeItem[] = [
  {
    id: "7",
    title: "旧版UI组件库文档",
    content: "这是我们旧版UI组件库的完整文档，包含了所有组件的使用方法和示例代码。由于我们已经升级到新版组件库，此文档已归档...",
    tags: ["UI", "组件库", "文档", "旧版"],
    createdAt: "2023-06-15",
    updatedAt: "2023-08-20",
    archivedAt: "2024-01-05"
  },
  {
    id: "8", 
    title: "2023年Q3项目总结",
    content: "2023年第三季度项目总结报告，包含各项目进度、成果、问题及解决方案。此报告已完成存档，供团队回顾参考...",
    tags: ["项目管理", "总结报告", "2023"],
    createdAt: "2023-09-30",
    updatedAt: "2023-10-05",
    archivedAt: "2024-01-10"
  },
  {
    id: "9",
    title: "旧版API接口规范",
    content: "这是我们旧版API接口的规范文档，详细说明了接口格式、认证方式、错误处理等。由于我们已经升级到新版API，此文档已归档...",
    tags: ["API", "接口", "规范", "旧版"],
    createdAt: "2023-05-10",
    updatedAt: "2023-07-15",
    archivedAt: "2023-12-20"
  },
  {
    id: "10",
    title: "旧版本发布说明",
    content: "这是我们产品旧版本的发布说明，包含了版本特性、改进和已知问题。由于我们已经发布了多个新版本，此文档已归档...",
    tags: ["产品", "发布说明", "旧版"],
    createdAt: "2023-04-05",
    updatedAt: "2023-04-10",
    archivedAt: "2023-11-15"
  },
  {
    id: "11",
    title: "已废弃的设计方案",
    content: "这是一个已废弃的产品设计方案，包含了初始设计思路、原型和评估结果。由于我们采用了新的设计方向，此方案已归档...",
    tags: ["设计", "方案", "废弃"],
    createdAt: "2023-03-20",
    updatedAt: "2023-05-25",
    archivedAt: "2023-10-30"
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

const sortOptions = [
  { value: "newest_archived", label: "最近归档" },
  { value: "oldest_archived", label: "最早归档" },
  { value: "newest_updated", label: "最近更新" },
  { value: "oldest_created", label: "最早创建" }
];

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest_archived");
  const [archivedItems, setArchivedItems] = useState<KnowledgeItem[]>(mockArchivedItems);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();

  // 初始化标签数据
  useEffect(() => {
    const tags = extractAllTags(archivedItems);
    setAllTags(tags);
    
    const counts = calculateTagCounts(archivedItems);
    setTagCounts(counts);
  }, [archivedItems]);

  // 过滤和排序归档项
  const filteredAndSortedItems = archivedItems
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
      if (sortBy === "newest_archived") {
        return new Date(b.archivedAt || "").getTime() - new Date(a.archivedAt || "").getTime();
      } else if (sortBy === "oldest_archived") {
        return new Date(a.archivedAt || "").getTime() - new Date(b.archivedAt || "").getTime();
      } else if (sortBy === "newest_updated") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else if (sortBy === "oldest_created") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 显示搜索提示
    toast({
      title: "搜索结果",
      description: `找到 ${filteredAndSortedItems.length} 条相关归档内容`,
    });
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleCardClick = (item: KnowledgeItem) => {
    toast({
      title: "查看归档内容",
      description: `正在查看: ${item.title}`,
    });
  };

  const handleRestoreItem = (item: KnowledgeItem, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击事件
    
    // 模拟恢复操作
    toast({
      title: "恢复归档内容",
      description: `已恢复: ${item.title}`,
    });
    
    // 在实际应用中，这里会调用API恢复归档内容，并从归档列表中移除
    // 这里仅做演示，从列表中移除该项
    setArchivedItems(prev => prev.filter(i => i.id !== item.id));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Archive Header */}
        <div className="bg-card border-b border-border/50 py-6">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-2xl font-bold mb-6">已归档内容</h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="搜索归档内容..."
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

        {/* Archive Content */}
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
                {allTags.map((tag) => (
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
                    <SelectTrigger className="w-[140px]">
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
                归档内容
                <span className="text-muted-foreground ml-2">({filteredAndSortedItems.length})</span>
              </h2>
            </div>

            {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-16 bg-card/50 rounded-lg border border-border/50">
                <ArchiveIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <div className="text-muted-foreground text-lg mb-2">
                  未找到匹配的归档内容
                </div>
                <p className="text-muted-foreground/70 mb-6 max-w-md mx-auto">
                  尝试使用不同的关键词或筛选条件，或者浏览所有归档内容
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
                  <div key={item.id} className="relative group">
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        className="h-8 px-2 bg-background/80 backdrop-blur-sm"
                        onClick={(e) => handleRestoreItem(item, e)}
                      >
                        <RefreshCcw className="h-4 w-4 mr-1" />
                        恢复
                      </Button>
                    </div>
                    <KnowledgeCard
                      item={item}
                      onClick={() => handleCardClick(item)}
                    />
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