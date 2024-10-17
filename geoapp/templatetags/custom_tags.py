from django import template
import os, logging

register = template.Library()
logger = logging.getLogger( "app.custom_tags")

@register.filter(name='has_group')
def has_group(user, group_name):
    
    #logger.debug(f"User: {user}, Group: {group_name} isSuper=> {user.is_superuser}")
    
    if ( user.is_superuser ):
            return 1

    if user.groups.filter(name=group_name).exists():
        return 1
    else:
        return 0

@register.filter(name='can_edit')
def can_edit(request, param):
    user = request.user;
    if ( user.is_superuser ):
        return 1

    filepath = request.GET.get(param, "");
    if (not filepath):
        filepath = request.POST.get(param, "");

    if (not filepath):
        return 0;

    if user.groups.filter(name="editall").exists():
        return 1

    if (filepath.find(f"/{user}/") >= 0 ):
        return 1

    fullpath = filepath
    if (not fullpath.startswith("/opt/data/")):
        fullpath = "/opt/data/" + filepath

    if ( os.path.exists(f"{fullpath}.meta")):
        pass;
    if (os.path.exists(f"{fullpath}.meta.1")):
        pass;

    return 0

@register.filter(name='all_groups')
def all_groups():
    return "All groups"


@register.filter(name='all_user_groups')
def all_user_groups(request):
    user = request.user;
    groups = f"{[k for k in user.groups.filter(name='*')]} \n\n : super user: {user.is_superuser}" 
    return f"{user} {groups}"
