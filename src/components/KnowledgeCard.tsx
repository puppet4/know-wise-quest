import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag, FileText } from "lucide-react";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeCardProps {
  item: KnowledgeItem;
  onClick: () => void;
}

export const KnowledgeCard = ({ item, onClick }: KnowledgeCardProps) => {
  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-large hover:scale-[1.02] bg-gradient-card border-border/50 hover:border-primary/20"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </CardTitle>
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {item.content}
        </p>
        
        {item.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {item.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-secondary/60 hover:bg-primary/10 transition-colors"
              >
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>更新于 {item.updatedAt}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};