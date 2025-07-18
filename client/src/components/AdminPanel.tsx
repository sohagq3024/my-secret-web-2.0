import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Users, 
  Clock, 
  DollarSign, 
  Check, 
  X,
  UserCheck,
  Mail,
  Settings,
  Image,
  Video,
  User,
  LogOut,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MembershipRequest } from "@shared/schema";

export function AdminPanel() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: membershipRequests = [], isLoading: requestsLoading } = useQuery<(MembershipRequest & { user: any })[]>({
    queryKey: ["/api/membership/requests"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/membership/requests/${id}/status`, { status });
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/membership/requests"] });
      toast({
        title: "Status updated",
        description: `Membership request ${status} successfully`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const handleUpdateStatus = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const pendingRequests = membershipRequests.filter(req => req.status === "pending");
  const approvedRequests = membershipRequests.filter(req => req.status === "approved");
  const totalRevenue = membershipRequests
    .filter(req => req.status === "approved")
    .reduce((sum, req) => sum + parseFloat(req.price), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-8">Admin Panel</h2>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`admin-nav-item w-full ${
                  activeTab === "dashboard" ? "active" : ""
                }`}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Dashboard
              </button>
              
              <button
                onClick={() => setActiveTab("requests")}
                className={`admin-nav-item w-full ${
                  activeTab === "requests" ? "active" : ""
                }`}
              >
                <Mail className="w-5 h-5 mr-3" />
                Requests
                {pendingRequests.length > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {pendingRequests.length}
                  </Badge>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab("slideshow")}
                className={`admin-nav-item w-full ${
                  activeTab === "slideshow" ? "active" : ""
                }`}
              >
                <Image className="w-5 h-5 mr-3" />
                Slideshow
              </button>
              
              <button
                onClick={() => setActiveTab("celebrities")}
                className={`admin-nav-item w-full ${
                  activeTab === "celebrities" ? "active" : ""
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Celebrities
              </button>
              
              <button
                onClick={() => setActiveTab("albums")}
                className={`admin-nav-item w-full ${
                  activeTab === "albums" ? "active" : ""
                }`}
              >
                <Image className="w-5 h-5 mr-3" />
                Albums
              </button>
              
              <button
                onClick={() => setActiveTab("videos")}
                className={`admin-nav-item w-full ${
                  activeTab === "videos" ? "active" : ""
                }`}
              >
                <Video className="w-5 h-5 mr-3" />
                Videos
              </button>
              
              <button
                onClick={() => setActiveTab("users")}
                className={`admin-nav-item w-full ${
                  activeTab === "users" ? "active" : ""
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                Users
              </button>
              
              <button
                onClick={() => setActiveTab("settings")}
                className={`admin-nav-item w-full ${
                  activeTab === "settings" ? "active" : ""
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </button>
            </nav>
          </div>
          
          <div className="absolute bottom-0 w-64 p-6">
            <div className="text-sm text-gray-600 mb-4">
              Logged in as: {user?.firstName} {user?.lastName}
            </div>
            <Button
              onClick={logout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {activeTab === "dashboard" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Requests</p>
                          <p className="text-2xl font-bold text-gray-800">
                            {membershipRequests.length}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Users className="text-primary h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Active Members</p>
                          <p className="text-2xl font-bold text-gray-800">
                            {approvedRequests.length}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <UserCheck className="text-green-600 h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Pending Requests</p>
                          <p className="text-2xl font-bold text-gray-800">
                            {pendingRequests.length}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Clock className="text-yellow-600 h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="text-2xl font-bold text-gray-800">
                            ${totalRevenue.toFixed(2)}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="text-blue-600 h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "requests" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Membership Requests</h1>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {requestsLoading ? (
                      <div className="text-center py-8">Loading requests...</div>
                    ) : pendingRequests.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No pending requests
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-4">User</th>
                              <th className="text-left p-4">Plan</th>
                              <th className="text-left p-4">Amount</th>
                              <th className="text-left p-4">Date</th>
                              <th className="text-left p-4">Payment Method</th>
                              <th className="text-left p-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingRequests.map((request) => (
                              <tr key={request.id} className="border-b">
                                <td className="p-4">
                                  <div>
                                    <div className="font-medium">
                                      {request.user?.firstName} {request.user?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {request.user?.email}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge variant="outline">
                                    {request.plan.replace("-", " ")}
                                  </Badge>
                                </td>
                                <td className="p-4">${request.price}</td>
                                <td className="p-4">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(request.createdAt).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge variant="secondary">
                                    {request.paymentMethod}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleUpdateStatus(request.id, "approved")}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleUpdateStatus(request.id, "rejected")}
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Placeholder sections for other tabs */}
            {activeTab === "slideshow" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Slideshow Management</h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">Slideshow management interface would go here.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "celebrities" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Celebrity Management</h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">Celebrity management interface would go here.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "albums" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Album Management</h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">Album management interface would go here.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "videos" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Video Management</h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">Video management interface would go here.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">User Management</h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">User management interface would go here.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">Settings interface would go here.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
